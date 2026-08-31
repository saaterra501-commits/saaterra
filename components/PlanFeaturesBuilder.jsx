'use client';

import { useState, useEffect } from 'react';
import { Check, X, Plus, Trash2, Sparkles, Layers, HelpCircle, ToggleLeft, ToggleRight, Star } from 'lucide-react';

const DEFAULT_ROWS = [
  {
    name: '5-Year Access to core software updates',
    values: { 'Starter Pass': true, 'Pro Pass': true, 'Agency Pass': true },
  },
  {
    name: 'Workspaces / User Accounts',
    values: { 'Starter Pass': '1 User Account', 'Pro Pass': '5 Team Seats', 'Agency Pass': 'Unlimited Seats' },
  },
  {
    name: 'Unlimited Campaigns & Workflows',
    values: { 'Starter Pass': false, 'Pro Pass': true, 'Agency Pass': true },
  },
  {
    name: 'Full API & Webhook Integrations',
    values: { 'Starter Pass': false, 'Pro Pass': true, 'Agency Pass': true },
  },
  {
    name: 'Priority WhatsApp VIP Support',
    values: { 'Starter Pass': false, 'Pro Pass': true, 'Agency Pass': true },
  },
  {
    name: 'Automated Data Export & CSV Reports',
    values: { 'Starter Pass': true, 'Pro Pass': true, 'Agency Pass': true },
  },
  {
    name: '100% White-Label (Custom Domain Branding)',
    values: { 'Starter Pass': false, 'Pro Pass': false, 'Agency Pass': true },
  },
  {
    name: 'Client Sub-Accounts & Reseller License',
    values: { 'Starter Pass': false, 'Pro Pass': false, 'Agency Pass': true },
  },
  {
    name: 'Dedicated 1-on-1 Account Manager',
    values: { 'Starter Pass': false, 'Pro Pass': false, 'Agency Pass': true },
  },
  {
    name: 'Monthly Usage / Broadcast Credits',
    values: { 'Starter Pass': '2,500 / month', 'Pro Pass': '10,000 / month', 'Agency Pass': '50,000 / month' },
  },
];

export default function PlanFeaturesBuilder({ pricingTiers = [], onChange }) {
  const [matrixRows, setMatrixRows] = useState(() => DEFAULT_ROWS);
  const [newFeatureName, setNewFeatureName] = useState('');

  // Active tiers only
  const activeTiers = pricingTiers.filter((t) => t.enabled !== false);

  // Sync matrix rows into pricingTiers format
  const syncToTiers = (rows, currentTiers) => {
    const updatedTiers = currentTiers.map((tier) => {
      const tierFeatures = rows.map((r) => {
        const val = r.values?.[tier.tierName] ?? r.values?.[tier.id] ?? false;
        const isIncluded = typeof val === 'boolean' ? val : Boolean(val);
        const text = typeof val === 'string' && val ? `${r.name}: ${val}` : r.name;
        return { text, included: isIncluded };
      });

      return {
        ...tier,
        features: tierFeatures,
      };
    });

    onChange(updatedTiers);
  };

  // Toggle boolean or edit value for a specific tier
  const handleToggleCell = (rowIdx, tierName) => {
    const updated = matrixRows.map((row, idx) => {
      if (idx !== rowIdx) return row;
      const currentVal = row.values?.[tierName];
      const newVal = typeof currentVal === 'boolean' ? !currentVal : (currentVal ? '' : true);
      return {
        ...row,
        values: {
          ...(row.values || {}),
          [tierName]: newVal,
        },
      };
    });

    setMatrixRows(updated);
    syncToTiers(updated, pricingTiers);
  };

  // Update text value directly for a tier
  const handleValueChange = (rowIdx, tierName, val) => {
    const updated = matrixRows.map((row, idx) => {
      if (idx !== rowIdx) return row;
      return {
        ...row,
        values: {
          ...(row.values || {}),
          [tierName]: val,
        },
      };
    });

    setMatrixRows(updated);
    syncToTiers(updated, pricingTiers);
  };

  // Add custom feature row
  const handleAddRow = (e) => {
    e?.preventDefault();
    if (!newFeatureName.trim()) return;

    const initialValues = {};
    activeTiers.forEach((tier, idx) => {
      // Default to included for higher tiers, excluded for starter
      initialValues[tier.tierName] = idx > 0;
    });

    const newRow = {
      name: newFeatureName.trim(),
      values: initialValues,
    };

    const updated = [...matrixRows, newRow];
    setMatrixRows(updated);
    syncToTiers(updated, pricingTiers);
    setNewFeatureName('');
  };

  // Delete row
  const handleDeleteRow = (rowIdx) => {
    const updated = matrixRows.filter((_, idx) => idx !== rowIdx);
    setMatrixRows(updated);
    syncToTiers(updated, pricingTiers);
  };

  return (
    <div className="space-y-4 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FF6B35]" />
            Plan Comparison & Features Matrix
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Toggle features for each active plan. Changes automatically sync to your software deal page!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            {activeTiers.length} Active {activeTiers.length === 1 ? 'Plan' : 'Plans'} Configured
          </span>
        </div>
      </div>

      {activeTiers.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <p className="text-xs font-bold text-slate-600">No active plans enabled in Step 1.</p>
          <p className="text-[11px] text-slate-400">Please enable at least 1 plan in the Basic & Pricing step.</p>
        </div>
      ) : (
        /* ── MATRIX COMPARISON TABLE ── */
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse">
            
            {/* TABLE HEAD */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-900">
                <th className="p-3 sm:p-4 min-w-[220px]">
                  <span>Feature / Capability</span>
                </th>

                {activeTiers.map((tier, tIdx) => (
                  <th
                    key={tIdx}
                    className={`p-3 sm:p-4 text-center min-w-[140px] border-l border-slate-200 relative ${
                      tier.isRecommended ? 'bg-orange-50/70' : ''
                    }`}
                  >
                    {tier.isRecommended && (
                      <span className="text-[9px] font-black bg-[#FF6B35] text-white px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                        MOST POPULAR
                      </span>
                    )}
                    <div className="text-xs font-black text-slate-950">{tier.tierName}</div>
                    <div className="text-[11px] font-bold text-[#FF6B35]">₹{(tier.price || 0).toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Max: {tier.totalCodes || 100} passes
                    </div>
                  </th>
                ))}

                <th className="p-3 text-center w-12"></th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {matrixRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Feature Name */}
                  <td className="p-3 sm:p-4 text-slate-900 font-bold">
                    {row.name}
                  </td>

                  {/* Active Tiers Columns */}
                  {activeTiers.map((tier, tIdx) => {
                    const rawVal = row.values?.[tier.tierName];
                    const isString = typeof rawVal === 'string';
                    const isChecked = Boolean(rawVal);

                    return (
                      <td
                        key={tIdx}
                        className={`p-3 sm:p-4 text-center border-l border-slate-200 ${
                          tier.isRecommended ? 'bg-orange-50/20' : ''
                        }`}
                      >
                        {isString ? (
                          <input
                            type="text"
                            value={rawVal}
                            onChange={(e) => handleValueChange(idx, tier.tierName, e.target.value)}
                            placeholder="e.g. 1 Account"
                            className="w-full text-center text-xs font-bold text-slate-800 bg-slate-100/80 border border-slate-200 rounded-lg py-1.5 px-2 focus:outline-none focus:border-[#FF6B35]"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleCell(idx, tier.tierName)}
                            className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                              isChecked
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-100 text-slate-300 border-slate-200 hover:bg-slate-200 hover:text-slate-500'
                            }`}
                            title={isChecked ? 'Included (Click to Remove)' : 'Click to Include'}
                          >
                            {isChecked ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </td>
                    );
                  })}

                  {/* Delete Row Button */}
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(idx)}
                      className="text-slate-300 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Delete this feature row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* ── ADD CUSTOM FEATURE ROW ── */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          placeholder="Type any custom feature (e.g. AI Content Generator, Custom Webhooks)..."
          value={newFeatureName}
          onChange={(e) => setNewFeatureName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddRow();
            }
          }}
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
        />

        <button
          type="button"
          onClick={handleAddRow}
          className="px-5 py-3 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Feature Row</span>
        </button>
      </div>

    </div>
  );
}
