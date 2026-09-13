import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, CheckCircle2, AlertTriangle, AlertOctagon, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

export const DemoHub = () => {
  const navigate = useNavigate();
  const { quickSwitchRole } = useAuth();

  const scenarios = [
    {
      id: 1,
      title: "Scenario 1: 100% Genuine 7/12 Extract (Pune)",
      badge: "Verified • Low Risk",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 bg-emerald-50",
      description: "Sample genuine extract for Survey No 142/3B, Wagholi, Haveli. All fields (Owner: Rameshwar Shivram Patil, Area: 2.45 Ha, Mutation: 4892) match cadastral registry with 100% score.",
      demoPoints: ["OCR field extraction confidence >95%", "RapidFuzz 100% exact name ratio", "Zero discrepancies flagged", "SHA-256 digital integrity verified"],
      docId: 1
    },
    {
      id: 2,
      title: "Scenario 2: Name Spelling Variation (Typo)",
      badge: "Needs Review • Medium Risk",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      icon: AlertTriangle,
      iconColor: "text-amber-600 bg-amber-50",
      description: "Document owner is 'Ramesh S. Patil' while the registered revenue record is 'Rameshwar Shivram Patil'. RapidFuzz computes an 88% similarity.",
      demoPoints: ["RapidFuzz token sort ratio (88%)", "Flagged as MEDIUM Risk: Spelling Variation", "AI suggestion: Check Aadhaar/PAN alias", "Officer can request clarification or approve"],
      docId: 2
    },
    {
      id: 3,
      title: "Scenario 3: High-Risk Title Impersonator / Fraud",
      badge: "🔴 Critical Fraud • High Risk",
      badgeColor: "bg-red-100 text-red-800 border-red-300",
      icon: AlertOctagon,
      iconColor: "text-red-600 bg-red-50",
      description: "Document claims title for high-value Hinjawadi IT zone parcel under 'Vikramaditya K. Singhania', whereas official title belongs to 'Anand Narayan Kulkarni'.",
      demoPoints: ["RapidFuzz similarity 12% (Severe mismatch)", "Fraud Risk Gauge spikes to 88/100 (HIGH RISK)", "AI plain-language explanation generated", "Officer console rejection workflow"],
      docId: 3
    },
    {
      id: 4,
      title: "Scenario 4: Land Area Inflation Discrepancy",
      badge: "High Risk • Area Inflation",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      icon: Scale,
      iconColor: "text-rose-600 bg-rose-50",
      description: "Document asserts land area of 5.80 Hectares in Baramati, whereas government cadastral survey master only sanctions 2.10 Hectares (3.70 Ha inflation).",
      demoPoints: ["Numerical boundary tolerance detection", "Area deviation of +3.70 Ha flagged as HIGH Risk", "Recommended action: Physical land re-survey", "Immutable audit entry generated"],
      docId: 4
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner - Sovereign GovTech Header */}
      <div className="bg-[#0B2545] rounded-xl p-6 text-white shadow-xs border border-slate-700/80">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="px-2.5 py-0.5 rounded-sm text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
            Smart India Hackathon (SIH) Evaluation Cockpit
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mt-2 text-white">LandSure AI Interactive Demo Hub</h1>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Demonstrate the entire end-to-end AI validation lifecycle to hackathon judges in 1 click. Each scenario showcases computer vision preprocessing, OCR extraction, RapidFuzz discrepancy detection, and officer adjudication.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          return (
            <div key={sc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sc.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{sc.title}</h3>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${sc.badgeColor}`}>
                      {sc.badge}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {sc.description}
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">
                  Key Evaluation Capabilities Demonstrated:
                </span>
                {sc.demoPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/review/${sc.docId}`)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
              >
                <span>Launch Live Inspection for {sc.title.split(':')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
