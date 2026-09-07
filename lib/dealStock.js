import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import LTDCode from '@/models/LTDCode';
import LTDOrder from '@/models/LTDOrder';
import Deal from '@/models/Deal';

/**
 * Calculates the exact real vendor license key stock for a deal and each of its pricing tiers.
 * Strict Rule: Only real keys added by Admin or Vendor count.
 * When real available stock is 0 -> isSoldOut = true.
 */
export async function calculateDealStock(deal) {
  if (!deal) return deal;

  try {
    await dbConnect();

    // Resolve real deal ObjectId from MongoDB if needed
    let dbDeal = null;
    let targetDealId = deal._id || deal.id;

    if (!targetDealId || !String(targetDealId).match(/^[0-9a-fA-F]{24}$/)) {
      if (deal.slug) {
        dbDeal = await Deal.findOne({ slug: deal.slug }).lean();
        if (dbDeal) targetDealId = dbDeal._id;
      }
    } else if (!deal.licenseKeys && targetDealId) {
      dbDeal = await Deal.findById(targetDealId).lean();
    }

    if (!deal._id && targetDealId) {
      deal._id = targetDealId;
    }

    let objectId = null;
    if (targetDealId && String(targetDealId).match(/^[0-9a-fA-F]{24}$/)) {
      try {
        objectId = new mongoose.Types.ObjectId(String(targetDealId));
      } catch (e) {}
    }

    const licenseKeysSource = (deal.licenseKeys && deal.licenseKeys.length > 0)
      ? deal.licenseKeys
      : (dbDeal?.licenseKeys || []);

    // 1. Get all already claimed license codes for this deal
    const orderQueries = [];
    if (objectId) orderQueries.push({ dealId: objectId });
    if (targetDealId) orderQueries.push({ dealId: String(targetDealId) });
    if (deal.slug) orderQueries.push({ dealSlug: deal.slug });

    const claimedOrders = orderQueries.length > 0
      ? await LTDOrder.find({ $or: orderQueries }).select('licenseCode').lean()
      : [];

    const usedCodeSet = new Set(
      claimedOrders.map((o) => (o.licenseCode ? o.licenseCode.trim().toUpperCase() : ''))
    );

    // 2. Get available codes in dedicated vault (LTDCode)
    const vaultQueries = [];
    if (objectId) vaultQueries.push({ dealId: objectId });
    if (targetDealId) vaultQueries.push({ dealId: String(targetDealId) });

    const availableLTD = vaultQueries.length > 0
      ? await LTDCode.find({
          $or: vaultQueries,
          status: 'available',
        }).select('code tier').lean()
      : [];

    // 3. Unused global codes on deal
    const globalRealCodes = Array.isArray(licenseKeysSource)
      ? licenseKeysSource.filter((c) => c && !usedCodeSet.has(c.trim().toUpperCase()))
      : [];

    // 4. Compute per-tier stock
    let dealTotalAvailableStock = 0;
    const updatedTiers = (deal.pricingTiers || []).map((tier, idx) => {
      const tierName = tier.tierName || `Tier ${idx + 1}`;

      // Vault codes matching this tier
      const vaultTierCodes = availableLTD.filter(
        (c) =>
          c.code &&
          !usedCodeSet.has(c.code.trim().toUpperCase()) &&
          (!c.tier ||
            c.tier.toLowerCase() === tierName.toLowerCase() ||
            (c.tier === 'Tier 1' && idx === 0))
      );

      // In-deal tier codes from deal editor Tab 6
      const inDealTierCodes = Array.isArray(tier.licenseCodes)
        ? tier.licenseCodes.filter((c) => c && !usedCodeSet.has(c.trim().toUpperCase()))
        : [];

      // Global deal codes count for first tier if not tier-specific
      const globalShare = idx === 0 ? globalRealCodes.length : 0;

      const availableStock = vaultTierCodes.length + inDealTierCodes.length + globalShare;
      dealTotalAvailableStock += availableStock;

      return {
        ...tier,
        availableStock,
        isSoldOut: availableStock <= 0,
      };
    });

    deal.pricingTiers = updatedTiers;
    deal.totalAvailableStock = dealTotalAvailableStock;
    deal.isAllSoldOut = dealTotalAvailableStock <= 0;

    return deal;
  } catch (err) {
    console.error('Error calculating deal stock:', err);
    return deal;
  }
}

/**
 * Helper to check if a specific deal and tier has available real stock.
 */
export async function getTierRealStock(deal, tierName) {
  if (!deal) return 0;
  const enrichedDeal = await calculateDealStock(deal);
  const matched = (enrichedDeal.pricingTiers || []).find(
    (t) => t.tierName?.toLowerCase() === tierName?.toLowerCase()
  );
  if (matched) {
    return matched.availableStock || 0;
  }
  return enrichedDeal.pricingTiers?.[0]?.availableStock || 0;
}
