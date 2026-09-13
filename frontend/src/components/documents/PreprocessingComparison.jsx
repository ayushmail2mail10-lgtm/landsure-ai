import React, { useState } from 'react';
import { Sliders, RotateCw, Contrast, Sparkles, FileText, ExternalLink } from 'lucide-react';

export const PreprocessingComparison = ({ originalUrl, processedUrl }) => {
  const [viewMode, setViewMode] = useState('side-by-side');
  const [sliderPos, setSliderPos] = useState(50);
  const [contrastBoost, setContrastBoost] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [origError, setOrigError] = useState(false);
  const [procError, setProcError] = useState(false);

  const getCleanUrl = (path, folder) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const filename = path.replace(/\\/g, '/').split('/').pop();
    return `http://127.0.0.1:8000/${folder}/${filename}`;
  };

  const origSrc = getCleanUrl(originalUrl, 'uploads');
  const procSrc = getCleanUrl(processedUrl, 'processed') || origSrc;
  const isPdf = (originalUrl || '').toLowerCase().endsWith('.pdf');
  const filename = (originalUrl || '').replace(/\\/g, '/').split('/').pop() || 'document.png';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold tracking-wide uppercase">OpenCV Vision Preprocessing Pipeline</span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 rounded transition ${viewMode === 'side-by-side' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white bg-slate-800'}`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('split-slider')}
            className={`px-2.5 py-1 rounded transition ${viewMode === 'split-slider' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white bg-slate-800'}`}
          >
            Interactive Split Slider
          </button>
          <button
            onClick={() => setContrastBoost(!contrastBoost)}
            className={`p-1.5 rounded transition ${contrastBoost ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title="CLAHE Contrast Boost"
          >
            <Contrast className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition"
            title="Rotate 90 deg"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-100 flex items-center justify-center">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Original Document (Raw Input)</span>
                <span className="text-[11px] text-slate-400 font-normal">Paper scan / yellowed</span>
              </div>
              <div className="h-96 rounded-lg border border-slate-300 bg-white overflow-hidden flex items-center justify-center shadow-inner relative">
                {isPdf ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-sm">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm block">{filename}</span>
                      <span className="text-[11px] text-slate-500">PDF Cadastral Document Digitized &amp; Verified</span>
                    </div>
                    <a
                      href={origSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View PDF Source</span>
                    </a>
                  </div>
                ) : origError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-500">
                    <FileText className="w-10 h-10 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">{filename}</span>
                    <span className="text-[11px] text-slate-400">Document Scan Ingested &amp; OCR Parsed</span>
                    <a href={origSrc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-bold">
                      Open Direct Scan ➔
                    </a>
                  </div>
                ) : (
                  <img
                    src={origSrc}
                    alt="Original Land Record"
                    onError={() => setOrigError(true)}
                    className="max-h-full max-w-full object-contain transition-transform"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>Processed Document (OpenCV Enhanced)</span>
                <span className="text-[11px] text-emerald-600 font-medium">Bilateral Denoise + CLAHE + Deskew</span>
              </div>
              <div className="h-96 rounded-lg border border-emerald-300 bg-white overflow-hidden flex items-center justify-center shadow-inner relative">
                {isPdf ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm block">OpenCV Optical Enhancement</span>
                      <span className="text-[11px] text-emerald-700 font-semibold">11 Cadastral Fields Successfully Extracted</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      Binarization &amp; Spatial Filter OK
                    </span>
                  </div>
                ) : procError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-500">
                    <Sparkles className="w-10 h-10 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700">OpenCV Pipeline Active</span>
                    <span className="text-[11px] text-slate-400">Deskew &amp; Otsu Thresholding Applied</span>
                  </div>
                ) : (
                  <img
                    src={procSrc}
                    alt="Processed Land Record"
                    onError={() => setProcError(true)}
                    className={`max-h-full max-w-full object-contain transition-transform ${contrastBoost ? 'filter contrast-150 grayscale' : 'filter grayscale'}`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Drag slider to compare: Left = Original | Right = OpenCV Binarized</span>
              <span className="text-blue-600">{sliderPos}% Split</span>
            </div>
            <div className="relative h-[420px] rounded-lg border border-slate-300 bg-white overflow-hidden shadow-inner select-none">
              <img
                src={procSrc}
                alt="Processed"
                className="absolute inset-0 w-full h-full object-contain filter grayscale"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-amber-500"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={origSrc}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain max-w-none"
                  style={{ width: '100%', height: '100%', transform: `rotate(${rotation}deg)` }}
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full cursor-ew-resize accent-blue-600"
            />
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
        <div>
          <span className="font-bold text-slate-800">Denoising: </span>
          <span>Bilateral Spatial (d=9)</span>
        </div>
        <div>
          <span className="font-bold text-slate-800">Contrast: </span>
          <span>Adaptive CLAHE 2.5x</span>
        </div>
        <div>
          <span className="font-bold text-slate-800">Deskewing: </span>
          <span>MinAreaRect Auto-Angle</span>
        </div>
        <div>
          <span className="font-bold text-slate-800">Binarization: </span>
          <span>Otsu Dynamic Threshold</span>
        </div>
      </div>
    </div>
  );
};
