import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  FileCheck2, 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Activity, 
  Sparkles 
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs">
        Loading System Analytics &amp; Cadastral Telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner - Sovereign GovTech Header */}
      <div className="bg-[#0B2545] rounded-xl p-6 text-white shadow-xs border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-sm text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
            System Administration &amp; National Analytics
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2 text-white">LandSure AI Central Directorate Console</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time cadastral processing performance, automated fraud telemetry, and system audits.
          </p>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Land Records"
          value={stats.total_land_records || 20}
          subtitle="Master Registry Parcels"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="OCR Processed"
          value={stats.total_documents}
          subtitle="Digitized Files"
          icon={FileCheck2}
          color="indigo"
        />
        <StatCard
          title="Certified Clean"
          value={stats.verified_documents}
          subtitle="Sanctioned Records"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="In Review"
          value={stats.pending_review}
          subtitle="Pending Adjudication"
          icon={Activity}
          color="amber"
        />
        <StatCard
          title="High/Med Risk"
          value={stats.suspicious_records}
          subtitle="Flagged by RapidFuzz"
          icon={ShieldAlert}
          color="crimson"
        />
        <StatCard
          title="Avg Accuracy"
          value={`${stats.average_ocr_confidence}%`}
          subtitle="AI Optical Confidence"
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Trends Area Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Monthly Document Inflow &amp; Verification</h3>
            <span className="text-xs text-slate-500">6 Months Rolling</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.upload_trends}>
                <defs>
                  <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#3b82f6" stop-opacity={0.8}/>
                    <stop offset="95%" stop-color="#3b82f6" stop-opacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#10b981" stop-opacity={0.8}/>
                    <stop offset="95%" stop-color="#10b981" stop-opacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="uploads" name="Total Uploads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUploads)" />
                <Area type="monotone" dataKey="verified" name="Verified Clear" stroke="#10b981" fillOpacity={1} fill="url(#colorVerified)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Verification Status Breakdown</h3>
            <span className="text-xs text-slate-500">All Submissions</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.status_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.status_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud Risk Distribution Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Automated Fraud Risk Distribution</h3>
            <span className="text-xs text-slate-500">RapidFuzz Scoring</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.risk_distribution}>
                <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Records Count">
                  {stats.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-risk-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District-wise Cadastral Volume */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">District-wise Land Record Repository</h3>
            <span className="text-xs text-slate-500">Multi-State Hub</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.district_distribution} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="district" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="records" name="Sanctioned Parcels" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional SIH Analytics Grid: Discrepancies by Type & Suspicious Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discrepancy Count by Type */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Discrepancy Breakdown by Category</h3>
            <span className="text-xs text-slate-500">Cadastral Variance Engine</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.discrepancy_types || []} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={150} />
                <Tooltip />
                <Bar dataKey="count" name="Incidents Flagged">
                  {(stats.discrepancy_types || []).map((entry, index) => (
                    <Cell key={`cell-disc-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Village / District Suspicious Land Watchlist */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Village &amp; District Suspicious Watchlist</h3>
            <span className="text-xs text-slate-500">RapidFuzz Surveillance</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Region / Village</th>
                  <th className="px-3 py-2">Top Discrepancy</th>
                  <th className="px-3 py-2">Risk Level</th>
                  <th className="px-3 py-2 text-right">Action Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(stats.suspicious_by_region || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="px-3 py-2 font-bold text-slate-900">{item.region}</td>
                    <td className="px-3 py-2 text-slate-600 text-[11px]">{item.top_issue}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                        item.risk === 'HIGH' ? 'bg-red-100 text-red-800' :
                        item.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.risk}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] font-bold text-slate-500">
                      {item.suspicious > 0 ? `${item.suspicious} Alert` : 'Clear'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Registered System Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Authorized System Users &amp; Officers</h3>
          <span className="text-xs text-slate-500">{users.length} Active Accounts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-bold text-slate-900">{u.full_name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.department || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-500">{u.mobile_number || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-600 font-bold">● Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
