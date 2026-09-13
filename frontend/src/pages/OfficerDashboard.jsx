import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/validation/RiskBadge';
import { 
  CheckSquare, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Search, 
  Filter, 
  ShieldAlert 
} from 'lucide-react';

export const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, under_review, approved, rejected

  const fetchQueue = async () => {
    try {
      const res = await api.get('/review/queue');
      setQueue(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const total = queue.length;
  const highRiskDocs = queue.filter(d => {
    const score = d.validation_result?.fraud_risk_score ?? 0;
    return score >= 70 && d.status !== 'approved';
  });
  const underReview = queue.filter(d => ['under_review', 'validated', 'uploaded'].includes(d.status)).length;
  const approved = queue.filter(d => d.status === 'approved').length;
  const rejected = queue.filter(d => ['rejected', 'correction_required'].includes(d.status)).length;

  const filteredDocs = queue.filter(doc => {
    if (filter === 'all') return true;
    if (filter === 'under_review') return ['under_review', 'validated', 'uploaded'].includes(doc.status);
    return doc.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Officer Welcome Banner - Sovereign GovTech Header */}
      <div className="bg-[#0B2545] rounded-xl p-6 text-white shadow-xs border border-slate-700/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-sm text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
            Revenue Jurisdiction: Pune Circle / Haveli Taluka
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2 text-white">Officer Verification &amp; Adjudication Console</h1>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as {user?.full_name} ({user?.department || 'Tehsildar Office • Department of Revenue'})
          </p>
        </div>

        <button
          onClick={() => navigate('/demo-hub')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition shrink-0 border border-blue-400/30"
        >
          Open SIH Demo Hub
        </button>
      </div>

      {/* 🚨 High-Risk Land Record Alert System - Realistic Vigilance Banner */}
      {highRiskDocs.length > 0 && (
        <div className="bg-rose-50 rounded-xl p-5 border-2 border-rose-500 shadow-xs text-slate-900 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
              <h3 className="text-sm font-extrabold tracking-wide uppercase text-rose-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                <span>High-Risk Cadastral Scrutiny Alert</span>
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-700 text-white shadow-xs">
              {highRiskDocs.length} Pending Immediate Scrutiny
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highRiskDocs.map(doc => {
              const structured = doc.structured_data || {};
              const val = doc.validation_result || {};
              const firstDisc = val.discrepancies?.[0];
              const reason = firstDisc?.suggested_action || val.ai_explanation || 'Severe title impersonation or area inflation detected.';
              const survey = structured.survey_number || 'Parcel';
              const owner = structured.owner_name || 'Unknown Owner';
              const village = structured.village || 'Pune Circle';
              const score = val.fraud_risk_score ?? 88;

              return (
                <div key={doc.id} className="bg-white border border-rose-300 rounded-xl p-3.5 flex flex-col justify-between space-y-2 hover:border-rose-500 transition shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-xs">Survey #{survey}</span>
                        <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-400/30 font-extrabold">
                          Fraud Risk {score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-semibold mt-0.5">
                        Claimed Title Holder: <span className="text-white font-bold">{owner}</span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Village: {village} • Doc Ref: {doc.document_number}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/review/${doc.id}`)}
                      className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow transition flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Now</span>
                    </button>
                  </div>
                  <div className="bg-red-950/40 p-2 rounded-lg border border-red-500/20 text-[11px] text-red-200">
                    <span className="font-bold text-red-300">Flag Reason: </span>
                    {reason}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Review Queue"
          value={underReview}
          subtitle="Pending officer inspection"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="High-Risk Alerts"
          value={highRiskDocs.length}
          subtitle="Fraud Score >= 70"
          icon={AlertOctagon}
          color="crimson"
        />
        <StatCard
          title="Approved Today"
          value={approved}
          subtitle="Certified with SHA-256 seal"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Caseload"
          value={total}
          subtitle="All digitized submissions"
          icon={CheckSquare}
          color="purple"
        />
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Land Record Verification Queue</h3>
            <p className="text-xs text-slate-500">Examine OCR extractions, RapidFuzz discrepancies, and make approvals</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition font-medium ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({total})
            </button>
            <button
              onClick={() => setFilter('under_review')}
              className={`px-3 py-1 rounded-md transition font-medium ${filter === 'under_review' ? 'bg-blue-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Pending ({underReview})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1 rounded-md transition font-medium ${filter === 'approved' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Certified ({approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-3 py-1 rounded-md transition font-medium ${filter === 'rejected' ? 'bg-red-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Disputed ({rejected})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading review queue...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No records found matching this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Record ID</th>
                  <th className="px-4 py-3">Document File</th>
                  <th className="px-4 py-3">Land Parcel</th>
                  <th className="px-4 py-3">OCR Conf</th>
                  <th className="px-4 py-3">AI Fraud Risk</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => {
                  const struct = doc.structured_data || {};
                  const val = doc.validation_result || {};
                  const parcel = struct.survey_number ? `Survey #${struct.survey_number} (${struct.village || 'Pune'})` : 'Survey #142/3';
                  const riskLevel = val.risk_level || 'LOW';
                  const fraudScore = val.fraud_risk_score ?? 0;

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-bold text-blue-900">{doc.document_number}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{doc.file_name}</td>
                      <td className="px-4 py-3 text-slate-600 font-semibold text-[11px]">{parcel}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">{doc.ocr_confidence || 92}%</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center space-x-1.5">
                          <RiskBadge level={riskLevel} />
                          <span className="text-[10px] text-slate-500 font-bold font-mono">
                            {fraudScore}/100
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/review/${doc.id}`)}
                          className={`inline-flex items-center px-3 py-1.5 font-bold rounded-lg shadow-sm transition text-white ${
                            fraudScore >= 70 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-800'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>{fraudScore >= 70 ? 'Inspect Risk' : 'Adjudicate'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
