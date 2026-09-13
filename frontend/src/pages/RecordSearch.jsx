import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Building, FileCheck, ArrowRight, Filter, Download } from 'lucide-react';

export const RecordSearch = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    survey_number: '',
    owner_name: '',
    village: '',
    district: '',
    mutation_number: ''
  });
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.survey_number) params.append('survey_number', filters.survey_number);
      if (filters.owner_name) params.append('owner_name', filters.owner_name);
      if (filters.village) params.append('village', filters.village);
      if (filters.district) params.append('district', filters.district);
      if (filters.mutation_number) params.append('mutation_number', filters.mutation_number);

      const res = await api.get(`/records/search?${params.toString()}`);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">National Cadastral &amp; 7/12 Search Engine</h2>
          <p className="text-xs text-slate-500">Query authentic land records across Maharashtra, Karnataka, and Uttar Pradesh registries</p>
        </div>

        {/* Filter Inputs */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">Survey / Gut No</label>
            <input
              type="text"
              value={filters.survey_number}
              onChange={(e) => setFilters({ ...filters, survey_number: e.target.value })}
              placeholder="e.g. 142/3B"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Owner Name</label>
            <input
              type="text"
              value={filters.owner_name}
              onChange={(e) => setFilters({ ...filters, owner_name: e.target.value })}
              placeholder="e.g. Rameshwar Patil"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Village / Gram</label>
            <input
              type="text"
              value={filters.village}
              onChange={(e) => setFilters({ ...filters, village: e.target.value })}
              placeholder="e.g. Wagholi"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">District</label>
            <input
              type="text"
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              placeholder="e.g. Pune"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow transition flex items-center justify-center space-x-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Searching...' : 'Search Records'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Verified Cadastral Records ({records.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Searching cadastral master...</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No records found matching query parameters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Survey No</th>
                  <th className="px-4 py-3">Title Holder</th>
                  <th className="px-4 py-3">Village / Taluka</th>
                  <th className="px-4 py-3">District / State</th>
                  <th className="px-4 py-3">Area (Ha)</th>
                  <th className="px-4 py-3">Tenure Type</th>
                  <th className="px-4 py-3">Health Score</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-blue-900">{r.survey_number}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{r.owner_name}</td>
                    <td className="px-4 py-3 text-slate-600">{r.village}, {r.taluka}</td>
                    <td className="px-4 py-3 text-slate-600">{r.district}, {r.state}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{r.total_area_hectares} Ha</td>
                    <td className="px-4 py-3 text-slate-600">{r.tenure_type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.health_score >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {r.health_score}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/records/${r.id}`)}
                        className="text-xs text-blue-700 hover:text-blue-900 font-bold"
                      >
                        View Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
