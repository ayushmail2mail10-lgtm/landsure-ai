import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RiskBadge = ({ riskLevel, level, score }) => {
  const resolved = (riskLevel || level || (score !== undefined ? (score >= 70 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW') : 'LOW')).toUpperCase();

  if (resolved === 'HIGH') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
        <AlertCircle className="w-3 h-3 mr-1 text-rose-600 shrink-0" />
        High Risk
      </span>
    );
  } else if (resolved === 'MEDIUM') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3 h-3 mr-1 text-amber-600 shrink-0" />
        Medium Risk
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600 shrink-0" />
        Low Risk
      </span>
    );
  }
};
