import React from 'react';
import { History, ShieldCheck, UserCheck, FileCheck, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const TimelineHistory = ({ logs = [], title = "Audit Trail Timeline" }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
        No audit entries recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        <History className="w-4 h-4 text-blue-600" />
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-3.5 space-y-6">
        {logs.map((log) => {
          const d = log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent';
          return (
            <div key={log.id} className="relative pl-6">
              <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center" />
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded uppercase">
                    {log.user_role}
                  </span>
                  <span className="text-[10px] text-slate-400">{d}</span>
                </div>
                
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">{log.username}: </span>
                  {log.new_value || "Updated record state"}
                </p>

                {log.previous_value && log.previous_value !== "None" && log.previous_value !== "N/A" && (
                  <p className="text-[11px] text-slate-400">
                    Old Value: {log.previous_value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
