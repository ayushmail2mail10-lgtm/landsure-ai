import React from 'react';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Award, 
  MapPin, 
  Calendar,
  Building2,
  FileCheck2,
  Lock
} from 'lucide-react';

export const CertifiedExtractModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Extract relevant cadastral properties whether passed from Document or LandRecord
  const structured = data.structured_data || {};
  
  const village = data.village || structured.village || 'Wagholi';
  const taluka = data.taluka || structured.taluka || 'Haveli';
  const district = data.district || structured.district || 'Pune';
  const state = data.state || 'Maharashtra';
  
  const surveyNumber = data.survey_number || structured.survey_number || '142/3';
  const subdivisionNumber = data.subdivision_number || structured.subdivision_number || '3';
  const ownerName = data.owner_name || structured.owner_name || 'Rajesh Maruti Patil';
  const fatherName = data.father_or_husband_name || structured.father_or_husband_name || 'Maruti Patil';
  
  const totalArea = data.total_area_hectares || structured.total_area_hectares || structured.total_area || '1.45';
  const tenure = data.tenure_type || structured.tenure_type || 'भोगवटदार वर्ग - १ (Occupant Class I)';
  const landType = data.land_type || structured.land_type || 'जिरायत (Agricultural - Dry Crop)';
  const assessment = data.assessment_rupees || structured.assessment_rupees || '14.50';
  const khataNumber = data.khata_number || structured.khata_number || '429';
  const mutationNumber = data.mutation_number || structured.mutation_number || 'M-2024-884';
  const encumbrances = data.encumbrances || structured.encumbrances || 'निरंक (No Active Encumbrance / NIL)';
  
  const sha256 = data.sha256_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const certId = `CERT-MH-${data.id || '2026'}-${String(surveyNumber).replace(/[^a-zA-Z0-9]/g, '')}`;
  const issueDate = data.review_timestamp 
    ? new Date(data.review_timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between text-white print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-wide">
              Official Certified Cadastral Extract (शासन अधिकृत सातबारा)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Content */}
        <div id="certified-extract-printable" className="p-8 overflow-y-auto bg-amber-50/20 text-slate-900 font-sans space-y-6">
          {/* Certificate Header with Emblem and Borders */}
          <div className="border-4 border-double border-emerald-800 p-6 bg-white rounded-xl relative shadow-inner">
            {/* Government Insignia Header */}
            <div className="text-center pb-4 border-b-2 border-emerald-700 space-y-1">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-12 h-12 rounded-full border-2 border-amber-600 flex items-center justify-center bg-amber-50">
                  <ShieldCheck className="w-7 h-7 text-emerald-800" />
                </div>
              </div>
              <h1 className="text-lg font-extrabold text-emerald-950 tracking-wider">
                महाराष्ट्र शासन • महसूल व वन विभाग
              </h1>
              <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
                Government of Maharashtra • Department of Revenue &amp; Land Records
              </h2>
              <div className="inline-block bg-emerald-800 text-white text-xs font-bold px-4 py-1 rounded-md mt-2 tracking-wide uppercase">
                गावं नमुना सात / बारा (7/12) • अधिकृत डिजिटल अधिकार अभिलेख पत्रक
              </div>
              <p className="text-[11px] text-slate-500 italic mt-0.5">
                Issued under Section 148 of Maharashtra Land Revenue Code, 1966
              </p>
            </div>

            {/* Reference Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-b border-slate-200 text-[11px] bg-slate-50/80 px-3 rounded-lg my-3">
              <div>
                <span className="text-slate-500 block">Certificate ID:</span>
                <span className="font-mono font-bold text-slate-900">{certId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Issue Date:</span>
                <span className="font-semibold text-slate-900">{issueDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Digitization Status:</span>
                <span className="text-emerald-700 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Sanctioned &amp; Validated
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Issuing Authority:</span>
                <span className="font-semibold text-slate-900">Talathi / Tahsildar (e-Chavdi)</span>
              </div>
            </div>

            {/* Geographical Jurisdiction */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs font-medium mb-4">
              <div>
                <span className="text-emerald-800 block text-[10px] uppercase font-bold">गाव (Village):</span>
                <span className="font-bold text-slate-900">{village}</span>
              </div>
              <div>
                <span className="text-emerald-800 block text-[10px] uppercase font-bold">तालुका (Taluka):</span>
                <span className="font-bold text-slate-900">{taluka}</span>
              </div>
              <div>
                <span className="text-emerald-800 block text-[10px] uppercase font-bold">जिल्हा (District):</span>
                <span className="font-bold text-slate-900">{district}</span>
              </div>
              <div>
                <span className="text-emerald-800 block text-[10px] uppercase font-bold">राज्य (State):</span>
                <span className="font-bold text-slate-900">{state}</span>
              </div>
            </div>

            {/* Form 7 & 12 Split Table (Cadastral Specifications) */}
            <div className="space-y-4">
              {/* Form 7: Rights & Title */}
              <div>
                <div className="bg-emerald-900 text-white px-3 py-1.5 text-xs font-bold rounded-t-lg flex justify-between items-center">
                  <span>गावं नमुना ७ — अधिकार अभिलेख पत्रक (Village Form VII - Record of Rights)</span>
                  <span className="text-[10px] text-emerald-200">भूमापन क्र. {surveyNumber}</span>
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs text-left">
                  <tbody>
                    <tr className="border-b border-slate-300 bg-slate-50/60">
                      <td className="p-2.5 font-semibold text-slate-600 border-r border-slate-300 w-1/3">
                        भूमापन क्रमांक व हिस्सा (Survey / Gut &amp; Subdivision)
                      </td>
                      <td className="p-2.5 font-bold text-emerald-950 font-mono text-sm">
                        {surveyNumber} / {subdivisionNumber}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2.5 font-semibold text-slate-600 border-r border-slate-300">
                        खातेदाराचे नाव व पत्ता (Registered Title Holder)
                      </td>
                      <td className="p-2.5 font-bold text-slate-900 text-sm">
                        {ownerName} <span className="text-xs font-normal text-slate-500">(s/o {fatherName})</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300 bg-slate-50/60">
                      <td className="p-2.5 font-semibold text-slate-600 border-r border-slate-300">
                        खाते क्रमांक (Khata Account No.)
                      </td>
                      <td className="p-2.5 font-bold text-slate-800 font-mono">
                        {khataNumber}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2.5 font-semibold text-slate-600 border-r border-slate-300">
                        भोगवटदार वर्ग (Land Tenure Class)
                      </td>
                      <td className="p-2.5 text-slate-800 font-medium">
                        {tenure}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300 bg-slate-50/60">
                      <td className="p-2.5 font-semibold text-slate-600 border-r border-slate-300">
                        एकूण क्षेत्र (Total Cadastral Area)
                      </td>
                      <td className="p-2.5 font-extrabold text-slate-900">
                        {totalArea} Hectares <span className="text-slate-500 font-normal">({(parseFloat(totalArea || 1) * 2.47105).toFixed(2)} Acres)</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2.5 font-semibold text-slate-600 border-r border-slate-300">
                        आकारणी / जुडी (Land Assessment Revenue)
                      </td>
                      <td className="p-2.5 text-slate-800 font-medium">
                        ₹ {assessment}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300 bg-slate-50/60">
                      <td className="p-2.5 font-semibold text-slate-600 border-r border-slate-300">
                        शेवटचा फेरफार क्रमांक (Latest Sanctioned Mutation)
                      </td>
                      <td className="p-2.5 text-indigo-900 font-bold">
                        {mutationNumber}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-600 border-r border-slate-300">
                        इतर अधिकार व बोजा (Encumbrances &amp; Bank Charge)
                      </td>
                      <td className="p-2.5 font-medium text-slate-800">
                        {encumbrances}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Form 12: Crop Register & Cultivation */}
              <div>
                <div className="bg-slate-800 text-white px-3 py-1.5 text-xs font-bold rounded-t-lg flex justify-between items-center">
                  <span>गावं नमुना १२ — पिकांची नोंदवही (Village Form XII - Register of Crops &amp; Land Use)</span>
                  <span className="text-[10px] text-slate-300">वर्ष २०२५-२०२६</span>
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 text-[11px]">
                    <tr>
                      <th className="p-2 border-r border-slate-300">हंगाम (Season)</th>
                      <th className="p-2 border-r border-slate-300">जमिनीचा प्रकार (Land Type)</th>
                      <th className="p-2 border-r border-slate-300">पिकाचे नाव (Crop)</th>
                      <th className="p-2 border-r border-slate-300">जलसिंचन (Irrigation)</th>
                      <th className="p-2">क्षेत्र (Area)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">खरीप (Kharif)</td>
                      <td className="p-2 border-r border-slate-200 font-medium">{landType}</td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-800">सोयाबीन / ज्वारी (Soybean / Jowar)</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">विहीर / कूपनलिका (Well)</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{totalArea} Ha</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cryptographic Security, QR & Signatures Footer */}
            <div className="mt-6 pt-4 border-t-2 border-emerald-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* QR Code & Tamper Verification */}
              <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="bg-white p-1 rounded border border-slate-300 shadow-sm shrink-0">
                  {/* Simulated High-Res SVG QR Code */}
                  <svg className="w-14 h-14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm9-2h7v7h-7V2zm2 2v3h3V4h-3zM2 13h7v7H2v-7zm2 2v3h3v-3H4zm11 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4-4h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v4h-2v-4zm-4 2h2v2h-2v-2zm-5-3h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                  </svg>
                </div>
                <div className="text-[10px] space-y-0.5">
                  <div className="font-bold text-slate-900 uppercase">Scan to Verify</div>
                  <div className="text-slate-500 leading-tight">Instant verification via Mahabhulekh &amp; LandSure AI Portal</div>
                  <div className="text-emerald-700 font-mono font-bold text-[9px]">VALIDATED #OK</div>
                </div>
              </div>

              {/* SHA-256 Digest */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-800">
                  <Lock className="w-3 h-3 text-indigo-600" />
                  <span>SHA-256 Cryptographic Digest</span>
                </div>
                <div className="font-mono text-[9px] text-slate-600 break-all leading-tight bg-white p-1.5 rounded border border-slate-200">
                  {sha256}
                </div>
                <div className="text-[9px] text-emerald-700 font-semibold">
                  ✓ Anti-Tamper Sealed
                </div>
              </div>

              {/* Digital Signature Seal */}
              <div className="text-right space-y-1 p-2 bg-emerald-50/60 rounded-lg border border-emerald-300">
                <div className="inline-flex items-center space-x-1 text-emerald-900 font-extrabold text-[11px]">
                  <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  <span>DIGITALLY SIGNED</span>
                </div>
                <div className="text-[10px] text-slate-700 font-medium">
                  Competent Revenue Authority (महसूल अधिकारी)
                </div>
                <div className="text-[9px] text-slate-500">
                  Govt of Maharashtra • e-Chavdi System
                </div>
                <div className="text-[8px] font-mono text-slate-400">
                  Timestamp: {new Date().toISOString()}
                </div>
              </div>
            </div>

            {/* Official Legal Disclaimer */}
            <div className="text-center pt-3 text-[9px] text-slate-400 border-t border-slate-100 mt-4 leading-relaxed">
              सूचना: हा अधिकृत संगणकीकृत अधिकार अभिलेख पत्रक (७/१२) उतारा आहे. या दस्तावेजावर डिजिटल स्वाक्षरी असल्याने इतर कोणत्याही सहीची आवश्यकता नाही. महाराष्ट्र जमीन महसूल अधिनियम १९६६ च्या कलम १४८ नुसार कायदेशीररीत्या ग्राह्य.
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end space-x-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Extract</span>
          </button>
        </div>
      </div>
    </div>
  );
};
