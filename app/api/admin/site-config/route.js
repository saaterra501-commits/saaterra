import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SiteConfig from '@/models/SiteConfig';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'WhatsApp Bots', slug: 'whatsapp-bots', description: 'WhatsApp marketing & bots', themeColor: '#25D366', icon: 'MessageSquare', active: true, order: 1 },
  { id: 'cat-2', name: 'AI & GEO SEO', slug: 'ai-geo-seo', description: 'AI search & keyword tools', themeColor: '#8B5CF6', icon: 'Sparkles', active: true, order: 2 },
  { id: 'cat-3', name: 'Lead Scrapers', slug: 'lead-scrapers', description: 'B2B leads & data extractors', themeColor: '#0284C7', icon: 'Target', active: true, order: 3 },
  { id: 'cat-4', name: 'CRM & Sales', slug: 'crm-sales', description: 'Sales pipelines & CRM', themeColor: '#FF6B35', icon: 'BarChart3', active: true, order: 4 },
  { id: 'cat-5', name: 'Video & Design', slug: 'video-design', description: 'AI video & design creators', themeColor: '#EC4899', icon: 'Video', active: true, order: 5 },
  { id: 'cat-6', name: 'Email Marketing', slug: 'email-marketing', description: 'Cold email & newsletters', themeColor: '#6366F1', icon: 'Mail', active: true, order: 6 },
  { id: 'cat-7', name: 'Developer Tools', slug: 'developer-tools', description: 'APIs & developer utilities', themeColor: '#0F172A', icon: 'Code', active: true, order: 7 },
  { id: 'cat-8', name: 'Analytics', slug: 'analytics', description: 'Website traffic & reports', themeColor: '#0D9488', icon: 'TrendingUp', active: true, order: 8 },
];

const DEFAULT_TOP_CATEGORIES = [
  { id: 'top-2', name: 'WhatsApp Bots', categoryKey: 'WhatsApp Bots', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 1, active: true },
  { id: 'top-3', name: 'AI & GEO SEO', categoryKey: 'AI & GEO SEO', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 3, active: true },
  { id: 'top-4', name: 'Lead Scrapers', categoryKey: 'Lead Scrapers', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 4, active: true },
  { id: 'top-5', name: 'CRM & Sales', categoryKey: 'CRM & Sales', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 5, active: true },
  { id: 'top-6', name: 'Video & Design', categoryKey: 'Video & Design', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 6, active: true },
  { id: 'top-7', name: 'Email Marketing', categoryKey: 'Email Marketing', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 7, active: true },
  { id: 'top-8', name: 'Developer Tools', categoryKey: 'Developer Tools', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 8, active: true },
  { id: 'top-9', name: 'Analytics', categoryKey: 'Analytics', image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 9, active: true },
];

export async function GET() {
  try {
    const admin = await getAuthUser();
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev && (!admin || admin.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    let config = await SiteConfig.findOne({ key: 'global_config' }).lean();

    if (!config) {
      config = await SiteConfig.create({
        key: 'global_config',
        categories: DEFAULT_CATEGORIES,
        topCategories: DEFAULT_TOP_CATEGORIES,
      });
      config = config.toObject ? config.toObject() : config;
    } else {
      let needsSave = false;
      const updateFields = {};

      if (!config.categories || config.categories.length === 0) {
        config.categories = DEFAULT_CATEGORIES;
        updateFields.categories = DEFAULT_CATEGORIES;
        needsSave = true;
      }
      if (!config.topCategories || config.topCategories.length === 0) {
        config.topCategories = DEFAULT_TOP_CATEGORIES;
        updateFields.topCategories = DEFAULT_TOP_CATEGORIES;
        needsSave = true;
      }

      if (needsSave) {
        await SiteConfig.updateOne({ key: 'global_config' }, { $set: updateFields });
      }
    }

    return NextResponse.json({ success: true, config });
  } catch (err) {
    console.error('Admin site-config GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await getAuthUser();
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev && (!admin || admin.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    // Fetch existing config to handle auto-sync between categories and topCategories
    const existing = await SiteConfig.findOne({ key: 'global_config' }).lean();
    let rawTopCats = body.topCategories || existing?.topCategories || DEFAULT_TOP_CATEGORIES;
    let topCats = rawTopCats.filter(
      (t) => !t.isMostPopular && (t.name || '').trim().toLowerCase() !== 'most popular' && t.id !== 'top-1' && t.id !== 'most-popular'
    );

    // If categories are being updated, ensure each category is also synchronized to topCategories
    if (body.categories && Array.isArray(body.categories)) {
      const existingKeySet = new Set(topCats.map((t) => (t.categoryKey || t.name || '').toLowerCase()));
      const updatedTopCats = [...topCats];

      body.categories.forEach((cat, idx) => {
        const catKey = (cat.name || '').trim();
        const lowerKey = catKey.toLowerCase();

        if (catKey && !existingKeySet.has(lowerKey)) {
          // Add newly created category to topCategories circular row automatically!
          updatedTopCats.push({
            id: `top-${cat.slug || cat.id || Date.now()}`,
            name: cat.name,
            categoryKey: cat.name,
            image: cat.image || '',
            isMostPopular: false,
            order: updatedTopCats.length + 1,
            active: cat.active !== false,
          });
          existingKeySet.add(lowerKey);
        } else if (catKey && existingKeySet.has(lowerKey)) {
          // Sync active status, name, image and themeColor
          const matchIdx = updatedTopCats.findIndex((t) => (t.categoryKey || t.name || '').toLowerCase() === lowerKey);
          if (matchIdx >= 0) {
            updatedTopCats[matchIdx].active = cat.active !== false;
            updatedTopCats[matchIdx].name = cat.name;
            if (cat.image !== undefined) {
              updatedTopCats[matchIdx].image = (cat.image || '').trim();
            }
            if (cat.themeColor) {
              updatedTopCats[matchIdx].themeColor = cat.themeColor;
            }
          }
        }
      });

      // Also ensure any topCategory with missing image inherits it from categories
      const allCatsList = body.categories || existing?.categories || [];
      const catMap = new Map();
      allCatsList.forEach((c) => {
        const k = (c.name || '').trim().toLowerCase();
        if (k) catMap.set(k, c);
      });

      topCats = updatedTopCats.map((tc) => {
        if (tc.isMostPopular) return tc;
        const k = (tc.categoryKey || tc.name || '').trim().toLowerCase();
        const matched = catMap.get(k);
        return {
          ...tc,
          image: (tc.image && tc.image.trim() !== '') ? tc.image.trim() : (matched?.image ? matched.image.trim() : ''),
          themeColor: tc.themeColor || matched?.themeColor || '#FF6B35',
        };
      });
    } else {
      // If topCategories were updated directly, ensure they inherit image from existing categories if empty
      const allCatsList = existing?.categories || [];
      const catMap = new Map();
      allCatsList.forEach((c) => {
        const k = (c.name || '').trim().toLowerCase();
        if (k) catMap.set(k, c);
      });

      topCats = topCats.map((tc) => {
        if (tc.isMostPopular) return tc;
        const k = (tc.categoryKey || tc.name || '').trim().toLowerCase();
        const matched = catMap.get(k);
        return {
          ...tc,
          image: (tc.image && tc.image.trim() !== '') ? tc.image.trim() : (matched?.image ? matched.image.trim() : ''),
          themeColor: tc.themeColor || matched?.themeColor || '#FF6B35',
        };
      });
    }

    const updateData = {
      ...(body.announcement && { announcement: body.announcement }),
      ...(body.greenStrip && { greenStrip: body.greenStrip }),
      ...(body.promoBanner && { promoBanner: body.promoBanner }),
      ...(body.seo && { seo: body.seo }),
      ...(body.faqs && { faqs: body.faqs }),
      ...(body.categories && { categories: body.categories }),
      topCategories: topCats,
    };

    await SiteConfig.collection.updateOne(
      { key: 'global_config' },
      { $set: updateData },
      { upsert: true }
    );

    const updated = await SiteConfig.findOne({ key: 'global_config' }).lean();

    return NextResponse.json({
      success: true,
      config: updated,
      message: 'Categories & site configuration saved and synced across homepage in real time!',
    });
  } catch (err) {
    console.error('Admin site-config POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
