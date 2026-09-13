import React from 'react';

export const FraudRiskGauge = ({ score = 0, riskLevel = "LOW", size = 180 }) => {
  // Score 0 to 100
  const normalized = Math.min(Math.max(score, 0), 100);
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half circle
  const progress = (normalized / 100) * circumference;

  let color = "#10b981"; // green
  let statusText = "Low Fraud Probability";
  if (normalized >= 65) {
    color = "#ef4444"; // red
    statusText = "High Fraud Risk / Forgery";
  } else if (normalized >= 30) {
    color = "#f59e0b"; // amber
    statusText = "Medium Risk / Review Required";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
        Fraud Risk Indicator
      </div>
      <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
        <svg width={size} height={size / 2 + 20} className="overflow-visible">
          {/* Background Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Needle / Score in Center */}
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
          <span className="text-3xl font-extrabold tracking-tight" style={{ color }}>
            {Math.round(normalized)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">SCORE / 100</span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `${color}18`,
            color: color,
            border: `1px solid ${color}40`
          }}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
};
