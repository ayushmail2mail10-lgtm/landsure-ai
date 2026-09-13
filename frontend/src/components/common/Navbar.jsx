import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  Languages, 
  User, 
  LogOut, 
  Bot, 
  CheckCircle2, 
  Layers, 
  FileCheck,
  ChevronDown,
  Building2,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ onOpenAssistant }) => {
  const { user, logout, quickSwitchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#0A192F] text-white border-b border-slate-800 shadow-md">
      {/* Top National Tricolor Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-[#FFFFFF]" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-2">
        {/* Left Official GovTech Masthead */}
        <div className="flex items-center space-x-3.5">
          {/* Government Emblem / Seal Container */}
          <div className="w-11 h-11 rounded-lg bg-gradient-to-b from-[#132E52] to-[#0A192F] flex items-center justify-center shadow-md border border-amber-400/40 shrink-0">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                LandSure <span className="text-amber-400">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-sm">
                GovTech India
              </span>
            </div>
            <div className="text-[10px] text-slate-300 flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-slate-200">भारत सरकार</span>
              <span>•</span>
              <span>National Land Record Digitization &amp; Cadastral Validation</span>
            </div>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Demo Role Switcher */}
          <div className="hidden md:flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700/80 shadow-xs">
            <span className="text-[11px] text-slate-400 px-2 font-semibold uppercase tracking-wider">Role:</span>
            <button
              onClick={() => quickSwitchRole('citizen')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                user?.role === 'citizen' 
                  ? 'bg-blue-600 text-white shadow-xs font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => quickSwitchRole('officer')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                user?.role === 'officer' 
                  ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Revenue Officer
            </button>
            <button
              onClick={() => quickSwitchRole('admin')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                user?.role === 'admin' 
                  ? 'bg-indigo-600 text-white shadow-xs font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Administrator
            </button>
          </div>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm border border-blue-400/30 transition"
            title="Open AI Land Record Assistant"
          >
            <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI Land Assistant</span>
          </button>

          {/* Language Switcher */}
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700 rounded-lg px-2 py-1.5 shadow-xs">
            <Languages className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Portal Language"
              className="bg-transparent text-xs font-medium text-slate-100 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
              <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
            </select>
          </div>

          {/* User Profile / Logout */}
          {user && (
            <div className="flex items-center space-x-2 border-l border-slate-700 pl-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-amber-400">
                {user.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-100 leading-tight">{user.full_name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{user.role}</div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Logout from portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
