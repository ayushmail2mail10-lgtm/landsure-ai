import React, { useState } from 'react';
import api from '../../services/api';
import { ShieldCheck, ShieldAlert, Copy, Check, RefreshCw } from 'lucide-react';

export const IntegrityBadge = ({ documentId, storedHash, isTampered }) => {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const copyHash = () => {
    navigator.clipboard.writeText(storedHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runVerification = async () => {
    if (!documentId) return;
    setVerifying(true);
    try {
      const res = await api.get(`/documents/${documentId}/verify-integrity`);
      setCheckResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const valid = checkResult ? checkResult.is_valid : !isTampered;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {valid ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-red-600 animate-bounce" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Document Cryptographic Seal
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
            valid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {valid ? '✓ Sealed & Intact' : '⚠ Tamper Detected'}
        </span>
      </div>

      <div className="bg-slate-900 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono text-slate-300">
        <span className="truncate mr-2 select-all">SHA-256: {storedHash}</span>
        <button
          onClick={copyHash}
          title="Copy Hash"
          className="p-1 hover:text-white transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <p className="text-slate-500 text-[11px]">
          {checkResult?.status_message || (valid ? 'Physical binary matches cryptographic certificate.' : 'Hash mismatch!')}
        </p>
        <button
          onClick={runVerification}
          disabled={verifying}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
          <span>Verify Live</span>
        </button>
      </div>
    </div>
  );
};
