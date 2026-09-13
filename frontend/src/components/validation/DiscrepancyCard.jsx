import React from 'react';
import { RiskBadge } from './RiskBadge';
import { AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

export const DiscrepancyCard = ({ discrepancy }) => {
  const {
    field_name,
    document_value,
    database_value,
    risk_level,
    discrepancy_type,
    suggested_action
  } = discrepancy;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-slate-800">{field_name}</span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
            {discrepancy_type}
          </span>
        </div>
        <RiskBadge riskLevel={risk_level} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs">
        <div>
          <span className="font-semibold text-slate-500 uppercase text-[10px] block">Uploaded Document Value:</span>
          <span className="font-bold text-red-600 text-sm">{document_value || "NOT DETECTED"}</span>
        </div>
        <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
          <span className="font-semibold text-slate-500 uppercase text-[10px] block">Official Registry Record:</span>
          <span className="font-bold text-emerald-700 text-sm">{database_value || "RECORD ABSENT"}</span>
        </div>
      </div>

      {suggested_action && (
        <div className="flex items-start space-x-2 text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900">Recommended Officer Action: </span>
            {suggested_action}
          </div>
        </div>
      )}
    </div>
  );
};
