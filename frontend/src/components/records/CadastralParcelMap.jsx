import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Maximize2, 
  Info, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon,
  ExternalLink
} from 'lucide-react';

export const CadastralParcelMap = ({ record }) => {
  const [mapMode, setMapMode] = useState('cadastral'); // 'cadastral' | 'satellite'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedParcel, setSelectedParcel] = useState(null);

  if (!record) return null;

  // Realistic geo-coordinates mapping by village/district
  const geoCoordinates = {
    'Wagholi': { lat: '18.5793° N', lng: '73.9804° E', elev: '570m' },
    'Shivajinagar': { lat: '18.5314° N', lng: '73.8446° E', elev: '560m' },
    'Hinjawadi': { lat: '18.5912° N', lng: '73.7389° E', elev: '585m' },
    'Baramati': { lat: '18.1517° N', lng: '74.5772° E', elev: '538m' },
    'Dindori': { lat: '20.2000° N', lng: '73.8333° E', elev: '610m' },
    'Umred': { lat: '20.8500° N', lng: '79.3333° E', elev: '280m' },
    'Bakshi Ka Talab': { lat: '26.9744° N', lng: '80.9256° E', elev: '123m' },
    'Devanahalli': { lat: '13.2483° N', lng: '77.7126° E', elev: '880m' },
  };

  const coords = geoCoordinates[record.village] || { lat: '18.5204° N', lng: '73.8567° E', elev: '560m' };

  // Determine risk level and color
  const healthScore = record.health_score ?? 100;
  let riskLevel = 'LOW';
  let riskScore = 0;
  let riskColor = 'emerald';
  let RiskIcon = ShieldCheck;

  if (healthScore < 50) {
    riskLevel = 'HIGH';
    riskScore = 88;
    riskColor = 'red';
    RiskIcon = AlertOctagon;
  } else if (healthScore < 85) {
    riskLevel = 'MEDIUM';
    riskScore = 45;
    riskColor = 'amber';
    RiskIcon = AlertTriangle;
  }

  // Surrounding cadastral cluster parcels
  const parcels = [
    {
      id: 'active',
      surveyNo: record.survey_number,
      owner: record.owner_name,
      area: `${record.total_area_hectares} Ha`,
      village: record.village,
      riskLevel: riskLevel,
      riskScore: riskScore,
      isActive: true,
      path: 'M 180 120 L 320 100 L 340 240 L 190 260 Z',
      labelX: 250,
      labelY: 180
    },
    {
      id: 'north',
      surveyNo: `${record.survey_number.split('/')[0] || '142'}/1`,
      owner: 'Pandurang S. Shinde',
      area: '1.80 Ha',
      village: record.village,
      riskLevel: 'LOW',
      riskScore: 5,
      isActive: false,
      path: 'M 170 30 L 310 20 L 320 100 L 180 120 Z',
      labelX: 245,
      labelY: 70
    },
    {
      id: 'east',
      surveyNo: `${record.survey_number.split('/')[0] || '142'}/4`,
      owner: 'Vikas Madhavrao Jagtap',
      area: '2.10 Ha',
      village: record.village,
      riskLevel: 'LOW',
      riskScore: 10,
      isActive: false,
      path: 'M 320 100 L 460 90 L 470 230 L 340 240 Z',
      labelX: 395,
      labelY: 170
    },
    {
      id: 'south',
      surveyNo: `${record.survey_number.split('/')[0] || '142'}/5`,
      owner: 'Grampanchayat Gaothan Public Land',
      area: '0.90 Ha',
      village: record.village,
      riskLevel: 'LOW',
      riskScore: 0,
      isActive: false,
      path: 'M 190 260 L 340 240 L 350 340 L 200 350 Z',
      labelX: 270,
      labelY: 295
    },
    {
      id: 'west',
      surveyNo: `${parseInt(record.survey_number.split('/')[0] || '142') - 1}/A`,
      owner: 'Kisan Balu Tupe',
      area: '3.15 Ha',
      village: record.village,
      riskLevel: 'LOW',
      riskScore: 8,
      isActive: false,
      path: 'M 50 130 L 180 120 L 190 260 L 60 270 Z',
      labelX: 120,
      labelY: 195
    }
  ];

  const currentDisplayParcel = selectedParcel || parcels[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Interactive GIS Cadastral Parcel Map</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase">
                BhuNaksha GIS
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Geo-referenced cadastral boundaries for Survey #{record.survey_number} • {record.village}, {record.taluka}
            </p>
          </div>
        </div>

        {/* Map Layer Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setMapMode('cadastral')}
              className={`px-2.5 py-1 rounded-md transition ${mapMode === 'cadastral' ? 'bg-white text-blue-700 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Cadastral Surveyor Grid
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded-md transition ${mapMode === 'satellite' ? 'bg-white text-blue-700 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Satellite Hybrid
            </button>
          </div>

          <div className="flex items-center space-x-1 border-l pl-2 border-slate-200">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition text-xs font-bold"
              title="Reset Zoom"
            >
              100%
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewer & Side Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive GIS Visualizer Canvas (2 Cols) */}
        <div className="lg:col-span-2 relative rounded-xl border border-slate-200 overflow-hidden bg-slate-950 h-96 select-none flex items-center justify-center">
          {/* Background Map Texture */}
          {mapMode === 'satellite' ? (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-stone-900 opacity-90">
              {/* Satellite terrain contours */}
              <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <filter id="topo">
                  <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" />
                  <feColorMatrix type="saturate" values="0.2"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#topo)" />
              </svg>
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#0f172a]">
              {/* Cadastral coordinate grid lines */}
              <svg className="w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}

          {/* Road / Canal Access Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 520 380">
            {/* Grampanchayat Road */}
            <path d="M 20 360 Q 250 350 500 370" fill="none" stroke="#fbbf24" strokeWidth="6" strokeDasharray="8 4" opacity="0.7" />
            <text x="360" y="365" fill="#fde047" fontSize="9" fontWeight="bold" opacity="0.85">7m Village PWD Approach Road</text>
            
            {/* Irrigation Canal */}
            <path d="M 10 20 Q 260 40 510 15" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.5" />
            <text x="35" y="32" fill="#7dd3fc" fontSize="9" fontWeight="bold" opacity="0.85">Minor Distributary Canal</text>
          </svg>

          {/* Dynamic SVG Zooming Container */}
          <div 
            className="w-full h-full flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg viewBox="0 0 520 380" className="w-full h-full max-h-96">
              {/* Render Parcels */}
              {parcels.map((p) => {
                const isSelected = selectedParcel ? selectedParcel.id === p.id : p.isActive;
                
                // Color configuration
                let fill = 'rgba(51, 65, 85, 0.4)';
                let stroke = '#64748b';
                let strokeWidth = 1.5;

                if (p.isActive) {
                  if (p.riskLevel === 'HIGH') {
                    fill = isSelected ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.35)';
                    stroke = '#ef4444';
                    strokeWidth = 3;
                  } else if (p.riskLevel === 'MEDIUM') {
                    fill = isSelected ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.35)';
                    stroke = '#f59e0b';
                    strokeWidth = 3;
                  } else {
                    fill = isSelected ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.35)';
                    stroke = '#10b981';
                    strokeWidth = 3;
                  }
                } else if (isSelected) {
                  fill = 'rgba(59, 130, 246, 0.4)';
                  stroke = '#3b82f6';
                  strokeWidth = 2.5;
                }

                return (
                  <g 
                    key={p.id}
                    onClick={() => setSelectedParcel(p)}
                    className="cursor-pointer transition hover:opacity-90"
                  >
                    <path
                      d={p.path}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      className="transition-all duration-150"
                    />
                    {/* Survey Number Label */}
                    <text
                      x={p.labelX}
                      y={p.labelY}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={p.isActive ? "13" : "11"}
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-md"
                    >
                      #{p.surveyNo}
                    </text>
                    <text
                      x={p.labelX}
                      y={p.labelY + 14}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="9"
                      fontWeight="600"
                      className="pointer-events-none"
                    >
                      {p.area}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Compass Rose */}
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded-lg text-slate-300 flex flex-col items-center">
            <Compass className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-200 mt-0.5">N</span>
          </div>

          {/* Geo-coordinate Floating HUD */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] text-slate-300 font-mono flex items-center space-x-3">
            <span>Lat: <strong className="text-emerald-400">{coords.lat}</strong></span>
            <span>Lon: <strong className="text-emerald-400">{coords.lng}</strong></span>
            <span>Elev: <strong>{coords.elev}</strong></span>
          </div>
        </div>

        {/* Selected Parcel Inspector Panel (1 Col) */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Parcel Inspector
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                currentDisplayParcel.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800 border-red-300' :
                currentDisplayParcel.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {currentDisplayParcel.riskLevel} RISK ({currentDisplayParcel.riskScore}/100)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Survey / Gut Number:</span>
                <span className="font-mono font-bold text-sm text-blue-950">
                  {currentDisplayParcel.surveyNo}
                </span>
                {currentDisplayParcel.isActive && (
                  <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                    Current Record
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Registered Owner:</span>
                <span className="font-bold text-slate-900">
                  {currentDisplayParcel.owner}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Land Area</span>
                  <span className="font-bold text-emerald-700">{currentDisplayParcel.area}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Village</span>
                  <span className="font-bold text-slate-800">{currentDisplayParcel.village}</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] font-bold uppercase block">
                  Boundary Verification Status
                </span>
                <div className="flex items-center space-x-1.5 text-[11px]">
                  {currentDisplayParcel.riskLevel === 'HIGH' ? (
                    <>
                      <AlertOctagon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="text-red-700 font-semibold">Boundary Discrepancy Flagged</span>
                    </>
                  ) : currentDisplayParcel.riskLevel === 'MEDIUM' ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-amber-700 font-semibold">Spelling / Minor Variance</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-emerald-700 font-semibold">Cadastral Registry Aligned</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <p className="text-[10px] text-slate-500 leading-tight">
              💡 Tip: Click any neighboring parcel on the map to inspect its cadastral ownership and boundary details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
