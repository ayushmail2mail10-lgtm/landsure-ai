import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend }) => {
  const colorMap = {
    blue: {
      border: "border-t-4 border-t-blue-700",
      iconBg: "bg-blue-50 text-blue-700 border-blue-200"
    },
    emerald: {
      border: "border-t-4 border-t-emerald-600",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    amber: {
      border: "border-t-4 border-t-amber-500",
      iconBg: "bg-amber-50 text-amber-700 border-amber-200"
    },
    purple: {
      border: "border-t-4 border-t-indigo-700",
      iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    crimson: {
      border: "border-t-4 border-t-rose-600",
      iconBg: "bg-rose-50 text-rose-700 border-rose-200"
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition ${scheme.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="truncate">{subtitle}</span>
          {trend && (
            <span className="text-emerald-700 font-bold text-[11px] shrink-0 ml-1">{trend}</span>
          )}
        </div>
      )}
    </div>
  );
};
