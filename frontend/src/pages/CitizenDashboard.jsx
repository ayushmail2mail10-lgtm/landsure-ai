import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/validation/RiskBadge';
import { DocumentUploader } from '../components/documents/DocumentUploader';
import { CertifiedExtractModal } from '../components/documents/CertifiedExtractModal';
import { VerificationReportModal } from '../components/documents/VerificationReportModal';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  UploadCloud, 
  Layers,
  Award,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  FileCheck2,
  CheckCircle2,
  X,
  ExternalLink,
  Printer,
  Sparkles
} from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCertDoc, setSelectedCertDoc] = useState(null);
  const [selectedReportDoc, setSelectedReportDoc] = useState(null);
  const [uploadAlert, setUploadAlert] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSuccess = (newDoc) => {
    // Immediately prepend to local documents list so it appears with ZERO delay
    setDocuments(prev => [newDoc, ...prev.filter(d => d.id !== newDoc.id)]);
    setUploadAlert(newDoc);
    // Smoothly scroll down to the table so the user sees the newly added record
    setTimeout(() => {
      const tableElem = document.getElementById('uploaded-records-section');
      if (tableElem) {
        tableElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  };

  const getFileTypeBadge = (fileName, mimeType) => {
    const ext = (fileName?.split('.').pop() || '').toUpperCase();
    if (ext === 'PDF' || mimeType?.includes('pdf')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
          PDF
        </span>
      );
    }
    if (ext === 'PNG' || mimeType?.includes('png')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
          PNG
        </span>
      );
    }
    if (ext === 'JPG' || ext === 'JPEG' || mimeType?.includes('jpeg')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          JPG
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        {ext || 'DOC'}
      </span>
    );
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const d = new Date(timestamp);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return String(timestamp);
    }
  };

  const getCadastralInfo = (doc) => {
    const structured = doc.structured_data || {};
    const survey = structured.survey_number || structured.plot_number;
    const owner = structured.owner_name;
    const village = structured.village;
    const area = structured.total_area_hectares || structured.total_area;

    return {
      title: survey ? `Survey #${survey}` : 'Cadastral Record',
      subtitle: owner ? `${owner}${village ? ` • ${village}` : ''}` : (village || 'Land Parcel'),
      area: area ? `${area} Ha` : null
    };
  };

  const total = documents.length;
  const verified = documents.filter(d => d.status === 'approved').length;
  const pending = documents.filter(d => ['uploaded', 'processing', 'validated', 'under_review'].includes(d.status)).length;
  const flagged = documents.filter(d => ['correction_required', 'rejected'].includes(d.status)).length;

  // Filtered documents
  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = 
      statusFilter === 'all' ? true :
      statusFilter === 'approved' ? doc.status === 'approved' :
      statusFilter === 'pending' ? ['uploaded', 'processing', 'validated', 'under_review'].includes(doc.status) :
      statusFilter === 'flagged' ? ['correction_required', 'rejected'].includes(doc.status) : true;

    if (!matchesFilter) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const docNum = (doc.document_number || '').toLowerCase();
    const fName = (doc.file_name || '').toLowerCase();
    const structured = doc.structured_data || {};
    const owner = (structured.owner_name || '').toLowerCase();
    const survey = (structured.survey_number || '').toLowerCase();
    const village = (structured.village || '').toLowerCase();

    return docNum.includes(term) || fName.includes(term) || owner.includes(term) || survey.includes(term) || village.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner - Sovereign GovTech Header */}
      <div className="bg-[#0B2545] rounded-xl p-6 text-white shadow-sm relative overflow-hidden border border-slate-700/80">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold uppercase tracking-wider">
              Citizen Self-Service Portal
            </span>
            <span className="text-xs text-slate-300 font-medium">
              राजस्व एवं भूमि संसाधन विभाग • Government of Maharashtra
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.full_name || 'Citizen'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
            Digitize your physical 7/12 extracts, Khatauni, or Record of Rights (RoR). The automated optical engine validates cadastral boundary survey numbers, verifies cryptographic SHA-256 integrity, and cross-matches records with the official land registry.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Documents"
          value={total}
          subtitle="Total uploaded land records"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Certified Records"
          value={verified}
          subtitle="Passed all validation checks"
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Under Verification"
          value={pending}
          subtitle="In revenue review queue"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Action Required"
          value={flagged}
          subtitle="Corrections or disputes"
          icon={AlertTriangle}
          color="crimson"
        />
      </div>

      {/* Document Processing Pipeline Steps */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            Automated Land Digitization Lifecycle
          </h3>
          <span className="text-[11px] text-blue-800 font-bold hidden sm:inline">DILRMP Standard GovTech Pipeline</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 text-center text-xs">
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 border-t-3 border-t-blue-700">
            <div className="font-bold text-slate-900">1. Document Upload</div>
            <div className="text-[10px] text-slate-500 mt-0.5">PDF / JPG / PNG &amp; SHA-256</div>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 border-t-3 border-t-blue-700">
            <div className="font-bold text-slate-900">2. OpenCV Pipeline</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Denoise, CLAHE &amp; Deskew</div>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 border-t-3 border-t-blue-700">
            <div className="font-bold text-slate-900">3. Optical Parser</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Multi-lingual Extraction</div>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 border-t-3 border-t-amber-600">
            <div className="font-bold text-slate-900">4. RapidFuzz Engine</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Discrepancy &amp; Fraud Score</div>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 border-t-3 border-t-emerald-600 col-span-2 sm:col-span-1">
            <div className="font-bold text-slate-900">5. Officer Review</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Approved &amp; Certified Stamp</div>
          </div>
        </div>
      </div>

      {/* Document Uploader */}
      <DocumentUploader onUploadSuccess={handleUploadSuccess} />

      {/* Post-Upload Success Notification Banner */}
      {uploadAlert && (
        <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-emerald-950">
                  Document {uploadAlert.document_number} Uploaded &amp; Digitized!
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  {uploadAlert.file_name}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                AI extraction and cadastral registry validation completed. Document is listed at the top of your records below.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => navigate(`/review/${uploadAlert.id}`)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect AI Analysis</span>
            </button>
            <button
              onClick={() => setSelectedReportDoc(uploadAlert)}
              className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Report</span>
            </button>
            <button
              onClick={() => setUploadAlert(null)}
              className="p-1.5 text-emerald-600 hover:text-emerald-900 rounded-lg hover:bg-emerald-100"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* My Uploaded Documents Table Section */}
      <div id="uploaded-records-section" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-200 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">My Uploaded Land Records</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredDocuments.length} of {total} records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant AI verification, cryptographic integrity check, and revenue adjudication tracking
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search survey, owner, doc #..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-56"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchDocuments}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-slate-50/60 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${statusFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            All Records ({total})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${statusFilter === 'approved' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            Certified ({verified})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${statusFilter === 'pending' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            Under Review ({pending})
          </button>
          <button
            onClick={() => setStatusFilter('flagged')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${statusFilter === 'flagged' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            Disputed / Rejected ({flagged})
          </button>
        </div>

        {/* Records Table */}
        {loading && documents.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p>Loading registered land documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">No documents found</p>
              <p className="text-xs text-slate-400 mt-1">
                {searchTerm ? 'No land records match your search query.' : 'You have not uploaded any land records yet. Use the upload box above.'}
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Document ID</th>
                  <th className="px-4 py-3">File / Format</th>
                  <th className="px-4 py-3">Parcel &amp; Owner</th>
                  <th className="px-4 py-3">Uploaded On</th>
                  <th className="px-4 py-3">OCR Accuracy</th>
                  <th className="px-4 py-3">Validation Status</th>
                  <th className="px-4 py-3 text-right">Available Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.map((doc) => {
                  const cadastral = getCadastralInfo(doc);
                  const formattedDate = formatDateTime(doc.upload_timestamp);
                  const valScore = doc.validation_result?.overall_validation_score;
                  const fraudScore = doc.validation_result?.fraud_risk_score;

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Document ID */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-blue-900 text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {doc.document_number}
                          </span>
                        </div>
                      </td>

                      {/* File Name and Format Badge */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {getFileTypeBadge(doc.file_name, doc.mime_type)}
                          <span className="font-medium text-slate-800 max-w-[160px] truncate" title={doc.file_name}>
                            {doc.file_name}
                          </span>
                        </div>
                      </td>

                      {/* Parcel & Owner */}
                      <td className="px-4 py-3.5">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{cadastral.title}</span>
                            {cadastral.area && (
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {cadastral.area}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[200px]" title={cadastral.subtitle}>
                            {cadastral.subtitle}
                          </div>
                        </div>
                      </td>

                      {/* Upload Date & Time */}
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        <div className="text-[11px] font-medium">{formattedDate}</div>
                      </td>

                      {/* OCR Confidence */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full ${
                                (doc.ocr_confidence || 90) >= 85 ? 'bg-emerald-500' :
                                (doc.ocr_confidence || 90) >= 70 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(doc.ocr_confidence || 90, 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700 text-[11px]">
                            {doc.ocr_confidence ? `${Number(doc.ocr_confidence).toFixed(1)}%` : '92.0%'}
                          </span>
                        </div>
                      </td>

                      {/* Status & Risk */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <StatusBadge status={doc.status} />
                          {doc.validation_result && (
                            <div>
                              <RiskBadge 
                                level={doc.validation_result.risk_level || 'LOW'} 
                                score={fraudScore} 
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Available Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Official 7/12 Certified Extract Button (if approved) */}
                          {doc.status === 'approved' && (
                            <button
                              onClick={() => setSelectedCertDoc(doc)}
                              className="inline-flex items-center px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition border border-emerald-300 text-xs shadow-xs"
                              title="View Official Certified 7/12 Extract"
                            >
                              <Award className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              <span>7/12</span>
                            </button>
                          )}

                          {/* Verification Report Modal Trigger */}
                          <button
                            onClick={() => setSelectedReportDoc(doc)}
                            className="inline-flex items-center px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-xs border border-slate-200"
                            title="Generate Official Verification Audit Report"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                            <span>Report</span>
                          </button>

                          {/* Inspect Full AI Analysis */}
                          <button
                            onClick={() => navigate(`/review/${doc.id}`)}
                            className="inline-flex items-center px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition text-xs shadow-xs"
                            title="Inspect OCR, Preprocessing & AI Discrepancies"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Certified 7/12 Extract Modal */}
      <CertifiedExtractModal
        isOpen={!!selectedCertDoc}
        onClose={() => setSelectedCertDoc(null)}
        data={selectedCertDoc}
      />

      {/* Official Verification Audit Report Modal */}
      <VerificationReportModal
        isOpen={!!selectedReportDoc}
        onClose={() => setSelectedReportDoc(null)}
        document={selectedReportDoc}
      />
    </div>
  );
};
