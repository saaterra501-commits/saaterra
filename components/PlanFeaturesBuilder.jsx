'use client';

import { useState, useEffect } from 'react';
import { Check, X, Plus, Trash2, Sparkles, Layers, HelpCircle } from 'lucide-react';

const DEFAULT_ROWS = [
  {
    name: '5-Year Access to core software updates',
    starter: true,
    pro: true,
    agency: true,
  },
  {
    name: 'Workspaces / User Accounts',
    starter: '1 User Account',
    pro: '5 Team Seats',
    agency: 'Unlimited Seats',
  },
  {
    name: 'Unlimited Campaigns & Workflows',
    starter: false,
    pro: true,
    agency: true,
  },
  {
    name: 'Full API & Webhook Integrations',
    starter: false,
    pro: true,
    agency: true,
  },
  {
    name: 'Priority WhatsApp VIP Support',
    starter: false,
    pro: true,
    agency: true,
  },
  {
    name: 'Automated Data Export & CSV Reports',
    starter: true,
    pro: true,
    agency: true,
  },
  {
    name: '100% White-Label (Custom Domain Branding)',
    starter: false,
    pro: false,
    agency: true,
  },
  {
    name: 'Client Sub-Accounts & Reseller License',
    starter: false,
    pro: false,
    agency: true,
  },
  {
    name: 'Dedicated 1-on-1 Account Manager',
    starter: false,
    pro: false,
    agency: true,
  },
  {
    name: 'Monthly Usage / Broadcast Credits',
    starter: '2,500 / month',
    pro: '10,000 / month',
    agency: '50,000 / month',
  },
];

export default function PlanFeaturesBuilder({ pricingTiers, onChange }) {
  // Initialize matrix rows from existing pricingTiers or defaults
  const [matrixRows, setMatrixRows] = useState(() => {
    return DEFAULT_ROWS;
  });

  const [newFeatureName, setNewFeatureName] = useState('');

  // Sync rows into pricingTiers format
  const syncToTiers = (rows) => {
    const starterFeatures = rows.map((r) => {
      const isIncluded = typeof r.starter === 'boolean' ? r.starter : Boolean(r.starter);
      const text = typeof r.starter === 'string' && r.starter ? `${r.name}: ${r.starter}` : r.name;
      return { text, included: isIncluded };
    });

    const proFeatures = rows.map((r) => {
      const isIncluded = typeof r.pro === 'boolean' ? r.pro : Boolean(r.pro);
      const text = typeof r.pro === 'string' && r.pro ? `${r.name}: ${r.pro}` : r.name;
      return { text, included: isIncluded };
    });

    const agencyFeatures = rows.map((r) => {
      const isIncluded = typeof r.agency === 'boolean' ? r.agency : Boolean(r.agency);
      const text = typeof r.agency === 'string' && r.agency ? `${r.name}: ${r.agency}` : r.name;
      return { text, included: isIncluded };
    });

    const updatedTiers = [
      {
        ...(pricingTiers[0] || {}),
        tierName: 'Starter Pass',
        price: pricingTiers[0]?.price || 1999,
        isRecommended: false,
        features: starterFeatures,
      },
      {
        ...(pricingTiers[1] || {}),
        tierName: 'Pro Pass',
        price: pricingTiers[1]?.price || 3999,
        isRecommended: true,
        features: proFeatures,
      },
      {
        ...(pricingTiers[2] || {}),
        tierName: 'Agency Pass',
        price: pricingTiers[2]?.price || 7999,
        isRecommended: false,
        features: agencyFeatures,
      },
    ];

    onChange(updatedTiers);
  };

  // Toggle boolean or edit value
  const handleToggleCell = (rowIdx, tierKey) => {
    const updated = matrixRows.map((row, idx) => {
      if (idx !== rowIdx) return row;
      const currentVal = row[tierKey];
      if (typeof currentVal === 'boolean') {
        return { ...row, [tierKey]: !currentVal };
      }
      // If it's a string value, clicking toggles between empty string and original string
      return { ...row, [tierKey]: currentVal ? '' : 'Included' };
    });

    setMatrixRows(updated);
    syncToTiers(updated);
  };

  // Update text value directly
  const handleValueChange = (rowIdx, tierKey, val) => {
    const updated = matrixRows.map((row, idx) => {
      if (idx !== rowIdx) return row;
      return { ...row, [tierKey]: val };
    });

    setMatrixRows(updated);
    syncToTiers(updated);
  };

  // Add custom feature row
  const handleAddRow = (e) => {
    e?.preventDefault();
    if (!newFeatureName.trim()) return;

    const newRow = {
      name: newFeatureName.trim(),
      starter: false,
      pro: true,
      agency: true,
    };

    const updated = [...matrixRows, newRow];
    setMatrixRows(updated);
    syncToTiers(updated);
    setNewFeatureName('');
  };

  // Delete row
  const handleDeleteRow = (rowIdx) => {
    const updated = matrixRows.filter((_, idx) => idx !== rowIdx);
    setMatrixRows(updated);
    syncToTiers(updated);
  };

  const starterPrice = pricingTiers[0]?.price || 1999;
  const proPrice = pricingTiers[1]?.price || 3999;
  const agencyPrice = pricingTiers[2]?.price || 7999;

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
            Check the boxes for the features included in each plan. Changes automatically sync to your software page!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            Simple 1-Click Toggle
          </span>
        </div>
      </div>

      {/* ── MATRIX COMPARISON TABLE ── */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
        <table className="w-full text-left border-collapse">
          
          {/* TABLE HEAD */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-900">
              <th className="p-3 sm:p-4 min-w-[220px]">
                <span>Feature / Capability</span>
              </th>

              {/* Starter Column */}
              <th className="p-3 sm:p-4 text-center min-w-[130px] border-l border-slate-200">
                <div className="text-xs font-black text-slate-900">Starter Pass</div>
                <div className="text-[11px] font-bold text-[#FF6B35]">₹{starterPrice.toLocaleString('en-IN')}</div>
              </th>

              {/* Pro Column (Recommended) */}
              <th className="p-3 sm:p-4 text-center min-w-[140px] border-l border-slate-200 bg-orange-50/60 relative">
                <span className="text-[9px] font-black bg-[#FF6B35] text-white px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-0.5">
                  POPULAR
                </span>
                <div className="text-xs font-black text-slate-950">Pro Pass</div>
                <div className="text-[11px] font-bold text-[#FF6B35]">₹{proPrice.toLocaleString('en-IN')}</div>
              </th>

              {/* Agency Column */}
              <th className="p-3 sm:p-4 text-center min-w-[130px] border-l border-slate-200">
                <div className="text-xs font-black text-slate-900">Agency Pass</div>
                <div className="text-[11px] font-bold text-[#FF6B35]">₹{agencyPrice.toLocaleString('en-IN')}</div>
              </th>

              <th className="p-3 text-center w-12"></th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-100 text-xs font-semibold">
            {matrixRows.map((row, idx) => {
              const isStarterString = typeof row.starter === 'string';
              const isProString = typeof row.pro === 'string';
              const isAgencyString = typeof row.agency === 'string';

              return (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Feature Name */}
                  <td className="p-3 sm:p-4 text-slate-900 font-bold">
                    {row.name}
                  </td>

                  {/* Starter Column */}
                  <td className="p-3 sm:p-4 text-center border-l border-slate-200">
                    {isStarterString ? (
                      <input
                        type="text"
                        value={row.starter}
                        onChange={(e) => handleValueChange(idx, 'starter', e.target.value)}
                        placeholder="e.g. 1 Account"
                        className="w-full text-center text-xs font-bold text-slate-800 bg-slate-100/80 border border-slate-200 rounded-lg py-1.5 px-2 focus:outline-none focus:border-[#FF6B35]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleCell(idx, 'starter')}
                        className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                          row.starter
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-100 text-slate-300 border-slate-200 hover:bg-slate-200 hover:text-slate-500'
                        }`}
                        title={row.starter ? 'Included in Starter (Click to Remove)' : 'Click to Include in Starter'}
                      >
                        {row.starter ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </td>

                  {/* Pro Column (Highlighted) */}
                  <td className="p-3 sm:p-4 text-center border-l border-slate-200 bg-orange-50/30">
                    {isProString ? (
                      <input
                        type="text"
                        value={row.pro}
                        onChange={(e) => handleValueChange(idx, 'pro', e.target.value)}
                        placeholder="e.g. 5 Seats"
                        className="w-full text-center text-xs font-bold text-slate-900 bg-white border border-orange-300 rounded-lg py-1.5 px-2 focus:outline-none focus:border-[#FF6B35]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleCell(idx, 'pro')}
                        className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                          row.pro
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-100 text-slate-300 border-slate-200 hover:bg-slate-200 hover:text-slate-500'
                        }`}
                        title={row.pro ? 'Included in Pro (Click to Remove)' : 'Click to Include in Pro'}
                      >
                        {row.pro ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </td>

                  {/* Agency Column */}
                  <td className="p-3 sm:p-4 text-center border-l border-slate-200">
                    {isAgencyString ? (
                      <input
                        type="text"
                        value={row.agency}
                        onChange={(e) => handleValueChange(idx, 'agency', e.target.value)}
                        placeholder="e.g. Unlimited"
                        className="w-full text-center text-xs font-bold text-slate-800 bg-slate-100/80 border border-slate-200 rounded-lg py-1.5 px-2 focus:outline-none focus:border-[#FF6B35]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleCell(idx, 'agency')}
                        className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                          row.agency
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-100 text-slate-300 border-slate-200 hover:bg-slate-200 hover:text-slate-500'
                        }`}
                        title={row.agency ? 'Included in Agency (Click to Remove)' : 'Click to Include in Agency'}
                      >
                        {row.agency ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </td>

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
              );
            })}
          </tbody>

        </table>
      </div>

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
