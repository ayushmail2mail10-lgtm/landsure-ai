import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Search, 
  CheckSquare, 
  BarChart3, 
  History, 
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck2
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isCitizen, isOfficer, isAdmin } = useAuth();
  const { t } = useLanguage();

  const citizenLinks = [
    { to: '/citizen', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/upload', icon: UploadCloud, label: t('uploadDoc') },
    { to: '/search', icon: Search, label: t('cadastralSearch') },
    { to: '/demo-hub', icon: Sparkles, label: t('demoHub') },
  ];

  const officerLinks = [
    { to: '/officer', icon: CheckSquare, label: t('reviewQueue') },
    { to: '/search', icon: Search, label: t('cadastralSearch') },
    { to: '/audit', icon: History, label: t('auditTrail') },
    { to: '/demo-hub', icon: Sparkles, label: t('demoHub') },
  ];

  const adminLinks = [
    { to: '/admin', icon: BarChart3, label: t('analytics') },
    { to: '/officer', icon: CheckSquare, label: 'Officer Console' },
    { to: '/search', icon: Search, label: t('cadastralSearch') },
    { to: '/audit', icon: History, label: t('auditTrail') },
    { to: '/demo-hub', icon: Sparkles, label: t('demoHub') },
  ];

  const links = isAdmin ? adminLinks : isOfficer ? officerLinks : citizenLinks;

  return (
    <aside className="w-64 bg-[#0A192F] text-slate-300 border-r border-slate-800 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4.75rem)] shadow-sm">
      <div className="p-4 space-y-6">
        {/* Department / Role Badge */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70 flex items-center space-x-3 shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
          <div className="truncate">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Authenticated Role</div>
            <div className="text-xs font-bold text-white uppercase truncate">{user?.role || 'Citizen Portal'}</div>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Cadastral Services
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs border-l-3 border-amber-400 pl-3'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* GovTech Footer Notice */}
      <div className="p-4 border-t border-slate-800/80 bg-[#071322] text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center space-x-1.5 font-bold text-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Digital India Land Portal</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          DILRMP Standards • NIC Secured Infrastructure
        </p>
        <p className="text-[9px] text-slate-400 font-mono">
          Release v2.0.0 GovTech Build
        </p>
      </div>
    </aside>
  );
};
