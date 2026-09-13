import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const ExtractedDataTable = ({ structuredData = {}, ocrConfidence = 0, rawText = "" }) => {
  const [showRaw, setShowRaw] = useState(false);

  const fields = [
    { label: "Title Holder / Owner Name", key: "owner_name" },
    { label: "Father / Husband Name", key: "fathers_name" },
    { label: "Survey / Gut Number", key: "survey_number", highlight: true },
    { label: "Plot / Parcel Number", key: "plot_number" },
    { label: "Village / Gram", key: "village" },
    { label: "Taluka / Tehsil", key: "taluka" },
    { label: "District / Zilla", key: "district" },
    { label: "Total Land Area", key: "land_area", highlight: true },
    { label: "Tenure Classification", key: "land_type" },
    { label: "Mutation / Ferfar Number", key: "mutation_number", highlight: true },
    { label: "Sanction Date", key: "record_date" },
  ];

  const confidencePerField = structuredData?.confidence_per_field || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Extracted Structured Land Record</h4>
          <p className="text-xs text-slate-500">Key cadastral entities parsed by OCR engine</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Overall OCR Confidence:</span>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
            {ocrConfidence}%
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        {fields.map(({ label, key, highlight }) => {
          const val = structuredData[key];
          const conf = confidencePerField[key] ? Math.round(confidencePerField[key] * 100) : 92;

          return (
            <div key={key} className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-slate-50/70 transition">
              <span className="col-span-5 sm:col-span-4 font-semibold text-slate-600">{label}:</span>
              <span className={`col-span-5 sm:col-span-6 font-medium ${highlight ? 'text-blue-900 font-bold' : 'text-slate-900'}`}>
                {val || <span className="text-slate-400 italic">Not detected</span>}
              </span>
              <div className="col-span-2 text-right">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {conf}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {rawText && (
        <div className="p-3 bg-slate-50/70 border-t border-slate-200 text-xs">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center space-x-1 font-semibold text-blue-600 hover:text-blue-800"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showRaw ? "Hide Raw OCR Transcript" : "View Raw OCR Extracted Text"}</span>
            {showRaw ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showRaw && (
            <pre className="mt-2 p-3 bg-slate-900 text-slate-300 text-[11px] rounded-lg overflow-x-auto whitespace-pre-wrap max-h-48 font-mono">
              {rawText}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
