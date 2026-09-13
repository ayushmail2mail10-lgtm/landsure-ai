import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TimelineHistory } from '../components/audit/TimelineHistory';
import { History, ShieldCheck, Search } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/audit');
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">National Cadastral Audit Log Registry</h2>
          <p className="text-xs text-slate-500">Immutable ledger of all uploads, OCR extractions, RapidFuzz validation passes, and officer approvals</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
          {logs.length} Total Audit Entries
        </span>
      </div>

      <TimelineHistory logs={logs} title="Central System Audit Trail (Real-time Timeline)" />
    </div>
  );
};
