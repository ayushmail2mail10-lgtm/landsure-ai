import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, FileSearch } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  switch (normalized) {
    case 'approved':
    case 'verified':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
          Certified &amp; Approved
        </span>
      );
    case 'under_review':
    case 'validated':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
          <Clock className="w-3 h-3 mr-1 text-blue-700" />
          Under Review
        </span>
      );
    case 'correction_required':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
          Correction Required
        </span>
      );
    case 'rejected':
    case 'disputed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
          <XCircle className="w-3 h-3 mr-1 text-rose-600" />
          Rejected / Disputed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <FileSearch className="w-3 h-3 mr-1 text-slate-500" />
          {status || 'Uploaded'}
        </span>
      );
  }
};
