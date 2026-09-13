import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CertifiedExtractModal } from '../components/documents/CertifiedExtractModal';
import { CadastralParcelMap } from '../components/records/CadastralParcelMap';
import { ArrowLeft, MapPin, Building, GitCommit, ShieldCheck, History, FileCheck, Award, Printer } from 'lucide-react';

export const RecordDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await api.get(`/records/${id}`);
        setRecord(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  if (loading || !record) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Cadastral Profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Survey Parcel #{record.survey_number}</h2>
            <p className="text-xs text-slate-500">{record.village}, {record.taluka}, {record.district} ({record.state})</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>📜 View Certified 7/12</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600">Record Health:</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              {record.health_score}/100 Pristine
            </span>
          </div>
        </div>
      </div>

      {/* Interactive GIS Cadastral Parcel Map */}
      <CadastralParcelMap record={record} />

      {/* Cadastral Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Cadastral Registry Attributes</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">Title Holder:</span><span className="font-bold text-slate-800">{record.owner_name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Father's Name:</span><span className="text-slate-800">{record.father_or_husband_name || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Survey / Gut No:</span><span className="font-bold text-blue-900">{record.survey_number}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Subdivision / Hissa:</span><span className="text-slate-800">{record.subdivision_number}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total Area:</span><span className="font-bold text-emerald-700">{record.total_area_hectares} Hectares</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Land Tenure:</span><span className="text-slate-800">{record.tenure_type}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Land Category:</span><span className="text-slate-800">{record.land_type}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Revenue Assessment:</span><span className="text-slate-800">₹ {record.assessment_rupees}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Encumbrances / Bank Loan:</span><span className="text-amber-700 font-semibold">{record.encumbrances || 'None'}</span></div>
          </div>
        </div>

        {/* Mutation History Tree */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Mutation History &amp; Title Chain</h3>
          {record.mutations && record.mutations.length > 0 ? (
            <div className="relative border-l-2 border-indigo-200 ml-2 space-y-4 pt-1">
              {record.mutations.map((m) => (
                <div key={m.id} className="relative pl-4 space-y-1">
                  <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-indigo-600" />
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-indigo-900">{m.mutation_number}</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">{m.mutation_type}</span>
                    <span className="text-[10px] text-slate-400">{m.mutation_date}</span>
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-400">Transferor:</span> {m.transferor_name || 'Ancestral'} ➔ <span className="font-bold text-slate-800">{m.transferee_name}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">{m.remarks}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-4">No historical mutations logged for this parcel.</div>
          )}
        </div>
      </div>

      {/* Official Certified 7/12 Extract Modal */}
      <CertifiedExtractModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        data={record}
      />
    </div>
  );
};
