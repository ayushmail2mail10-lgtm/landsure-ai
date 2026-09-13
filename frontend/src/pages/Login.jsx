import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, ShieldAlert, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, quickSwitchRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'officer') navigate('/officer');
      else navigate('/citizen');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid login credentials.');
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    try {
      const user = await quickSwitchRole(role);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'officer') navigate('/officer');
      else navigate('/citizen');
    } catch {
      setError('Demo login failed. Make sure backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top National Tricolor Stripe */}
      <div className="fixed top-0 inset-x-0 h-1.5 flex z-50 shadow-xs">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-[#FFFFFF]" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      {/* Background Subtle Geometric Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Official GovTech Header / Masthead */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-[#0B2545] flex items-center justify-center mx-auto shadow-md border-2 border-amber-400/70">
          <ShieldCheck className="w-9 h-9 text-amber-400" />
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">भारत सरकार</span>
          <span className="text-slate-400">•</span>
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Government of India</span>
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
          LandSure <span className="text-blue-700">AI</span>
        </h2>
        <p className="mt-0.5 text-xs font-semibold text-slate-600">
          राजस्व एवं भूमि संसाधन विभाग • Department of Land Resources
        </p>
        <p className="text-[11px] text-slate-500 font-medium">
          National Cadastral Digitization &amp; Validation Portal
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
          {/* Top Navy Ribbon */}
          <div className="bg-[#0B2545] px-6 py-3 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                Official Portal Sign-In
              </h3>
              <p className="text-[10px] text-slate-300">
                Authorized Revenue &amp; Citizen Access
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              GovTech SSO
            </span>
          </div>

          <div className="py-6 px-6 sm:px-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official Email Address
                </label>
                <div className="mt-1 relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@landsure.gov.in"
                    className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545] bg-slate-50/50 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Security Password
                </label>
                <div className="mt-1 relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545] bg-slate-50/50 font-medium text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-xs font-bold text-white bg-[#0B2545] hover:bg-[#133E87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2545] disabled:opacity-50 transition tracking-wide"
              >
                {loading ? 'Verifying with Central Registry...' : 'Sign In to Official Portal'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </form>

            {/* 1-Click SIH Hackathon Demo Logins */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                  SIH Quick Role Login:
                </span>
                <span className="text-[10px] font-bold text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  1-Click Access
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('citizen')}
                  className="p-2 text-center bg-slate-50 hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-lg text-xs font-bold text-blue-900 transition shadow-xs"
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('officer')}
                  className="p-2 text-center bg-slate-50 hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 rounded-lg text-xs font-bold text-emerald-900 transition shadow-xs"
                >
                  Revenue Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="p-2 text-center bg-slate-50 hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded-lg text-xs font-bold text-indigo-950 transition shadow-xs"
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
              New Citizen?{' '}
              <Link to="/register" className="font-bold text-blue-800 hover:underline">
                Register Citizen Account
              </Link>
            </div>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="mt-4 text-center text-[11px] text-slate-500 space-y-0.5">
          <p className="font-semibold text-slate-600">Digital India Land Records Modernization Programme (DILRMP)</p>
          <p className="text-[10px] text-slate-400">Secured with 256-Bit SHA Encryption • NIC Architecture Standards</p>
        </div>
      </div>
    </div>
  );
};
