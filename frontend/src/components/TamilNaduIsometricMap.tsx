import React, { useState } from 'react';
import { District } from '../types';
import { EXACT_TAMIL_NADU_DISTRICTS, ExactDistrictShape } from '../data/exactDistrictPaths';
import {
  Compass,
  MapPin,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { KolamCorner } from './common/TraditionalMotifs';

interface TamilNaduIsometricMapProps {
  districts: District[];
  selectedDistrict: District | null;
  selectedTaluk: string;
  onSelectDistrict: (district: District | null) => void;
  onSelectTaluk: (taluk: string) => void;
}

export const TamilNaduIsometricMap: React.FC<TamilNaduIsometricMapProps> = ({
  districts,
  selectedDistrict,
  selectedTaluk,
  onSelectDistrict,
  onSelectTaluk
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<ExactDistrictShape | null>(null);

  // Match the selectedDistrict ID with the exact shape record
  const currentSelectedShape = EXACT_TAMIL_NADU_DISTRICTS.find(
    (d) => d.id === selectedDistrict?.id || d.name.toLowerCase() === selectedDistrict?.name?.toLowerCase()
  );

  return (
    <div className="bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] shadow-2xs p-6 space-y-5 relative overflow-hidden">
      <KolamCorner position="top-right" size={36} opacity={0.15} color="#9E3A26" className="absolute top-2 right-2" />

      {/* Top Controls Bar: Dropdowns & Reset */}
      <div className="bg-white p-4 rounded-xl border border-[#E2DDD5] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DDD5] pb-2.5">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#9E3A26]" />
            <h2 className="text-sm font-heading font-extrabold text-[#1F2421]">
              Tamil Nadu State Administrative Map
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2D5A3D]/10 text-[#2D5A3D] border border-[#2D5A3D]/25">
              Authentic Geographical Boundaries
            </span>
          </div>

          {selectedDistrict && (
            <button
              onClick={() => {
                onSelectDistrict(null);
                onSelectTaluk('');
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F5F2EA] hover:bg-[#EFECE6] text-[#1F2421] border border-[#E2DDD5] flex items-center space-x-1 transition-all self-start"
            >
              <RotateCcw className="w-3 h-3 text-[#9E3A26]" />
              <span>Reset Selection</span>
            </button>
          )}
        </div>

        {/* Dropdown Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* District Dropdown */}
          <div className="space-y-1">
            <label className="font-bold text-[#1F2421] block">
              1. Select District:
            </label>
            <select
              value={selectedDistrict?.id || ''}
              onChange={(e) => {
                const shape = EXACT_TAMIL_NADU_DISTRICTS.find((d) => d.id === e.target.value);
                if (shape) {
                  onSelectDistrict(shape as any);
                } else {
                  onSelectDistrict(null);
                }
                onSelectTaluk('');
              }}
              className="w-full bg-[#FAF9F5] border border-[#E2DDD5] rounded-lg px-3 py-2 text-xs font-semibold text-[#1F2421] focus:ring-1 focus:ring-[#9E3A26] focus:outline-hidden cursor-pointer"
            >
              <option value="">-- Choose from Districts --</option>
              {EXACT_TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.region} Region)
                </option>
              ))}
            </select>
          </div>

          {/* Area / Taluk Dropdown */}
          <div className="space-y-1">
            <label className="font-bold text-[#1F2421] block">
              2. Select Area / Taluk:
            </label>
            <select
              value={selectedTaluk}
              onChange={(e) => onSelectTaluk(e.target.value)}
              disabled={!selectedDistrict}
              className={`w-full border rounded-lg px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-[#9E3A26] focus:outline-hidden cursor-pointer ${
                selectedDistrict
                  ? 'bg-[#FAF9F5] border-[#E2DDD5] text-[#1F2421]'
                  : 'bg-[#F5F2EA] border-[#E2DDD5] text-[#858B87] cursor-not-allowed'
              }`}
            >
              <option value="">
                {selectedDistrict ? `-- All Areas in ${selectedDistrict.name} --` : '-- Choose a District First --'}
              </option>
              {currentSelectedShape?.taluks?.map((tname) => (
                <option key={tname} value={tname}>
                  {tname} Taluk
                </option>
              ))}
            </select>
          </div>

          {/* Active Status Display */}
          <div className="flex flex-col justify-center p-2.5 rounded-lg bg-[#F5F2EA] border border-[#E2DDD5]">
            <span className="text-[10px] font-bold text-[#858B87] uppercase tracking-wider">Active Focus</span>
            <div className="text-xs font-bold text-[#1F2421] truncate">
              {selectedDistrict ? `${selectedDistrict.name} District` : 'Whole State'}
              {selectedTaluk ? ` • ${selectedTaluk}` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D Isometric Map Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-gradient-to-b from-[#ECE7DF] via-[#E2DDD5] to-[#D8D2C6] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm min-h-[620px] border border-[#D8D2C6]">
          {/* Subtle instruction pill */}
          <div className="absolute top-4 left-4 z-10 bg-[#FAF9F5]/90 backdrop-blur-md text-[#1F2421] text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#E2DDD5] flex items-center space-x-1.5 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#9E3A26]" />
            <span>Click any district boundary to focus</span>
          </div>

          {/* Isometric 3D SVG Map with EXACT Geographic Contours */}
          <svg
            viewBox="0 0 600 720"
            className="w-full max-w-[520px] h-auto drop-shadow-lg transition-all duration-300 select-none"
          >
            <defs>
              {/* Soft Drop Shadow Filter for 3D Relief */}
              <filter id="mapShadow3D" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="-10" dy="18" stdDeviation="12" floodColor="#1F2421" floodOpacity="0.2" />
              </filter>

              {/* 3D Extrusion Side Wall Gradient */}
              <linearGradient id="extrusionSide" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C8C0B2" />
                <stop offset="100%" stopColor="#A8A092" />
              </linearGradient>

              {/* Warm Ivory Top Surface */}
              <linearGradient id="districtWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FAF8F3" />
              </linearGradient>

              {/* Hover Highlight (Antique Gold Glow) */}
              <linearGradient id="hoverGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDF8EE" />
                <stop offset="100%" stopColor="#F5E8C8" />
              </linearGradient>

              {/* Selected Highlight (Terracotta / Tamil Red) */}
              <linearGradient id="selectedDistrictGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B23B23" />
                <stop offset="100%" stopColor="#8C2D19" />
              </linearGradient>
            </defs>

            {/* 1. LAYER A: 3D EXTRUSION SHADOW & SIDE DEPTH */}
            <g id="extrusion-depth-layer" transform="translate(-8, 14)" filter="url(#mapShadow3D)">
              {EXACT_TAMIL_NADU_DISTRICTS.map((d) => (
                <path
                  key={`side-${d.id}`}
                  d={d.path}
                  fill="url(#extrusionSide)"
                  stroke="#989082"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              ))}
            </g>

            {/* 2. LAYER B: TOP SURFACE WITH EXACT BOUNDARY LINES */}
            <g id="districts-top-surface">
              {EXACT_TAMIL_NADU_DISTRICTS.map((d) => {
                const isSelected = currentSelectedShape?.id === d.id;
                const isHovered = hoveredDistrict?.id === d.id;

                return (
                  <g
                    key={`top-${d.id}`}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={() => setHoveredDistrict(d)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onClick={() => {
                      onSelectDistrict(d as any);
                      onSelectTaluk('');
                    }}
                  >
                    {/* Real District Boundary with Separated Border Lines */}
                    <path
                      d={d.path}
                      fill={
                        isSelected
                          ? 'url(#selectedDistrictGlow)'
                          : isHovered
                          ? 'url(#hoverGlow)'
                          : 'url(#districtWhite)'
                      }
                      stroke={
                        isSelected
                          ? '#7F2A19'
                          : isHovered
                          ? '#B58D3D'
                          : '#C8C0B2'
                      }
                      strokeWidth={isSelected ? '2.5' : isHovered ? '2.0' : '1.2'}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="transition-colors duration-150"
                    />

                    {/* Exact Centered District Label */}
                    <text
                      x={d.center[0]}
                      y={d.center[1]}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isSelected ? '9' : '7.5'}
                      fontWeight={isSelected ? 'bold' : '600'}
                      fill={isSelected ? '#FFFFFF' : '#2C302E'}
                      className="pointer-events-none select-none tracking-tight font-sans"
                    >
                      {d.name.length > 9 ? d.name.substring(0, 8) + '..' : d.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Floating Hover Badge on Map */}
          {hoveredDistrict && (
            <div className="absolute bottom-5 right-5 z-20 bg-[#FAF9F5]/95 backdrop-blur-md text-[#1F2421] px-4 py-2.5 rounded-xl border border-[#E2DDD5] shadow-lg pointer-events-none text-xs space-y-0.5">
              <div className="font-heading font-bold text-sm text-[#9E3A26]">{hoveredDistrict.name} District</div>
              <div className="text-[11px] text-[#5E6460]">
                {hoveredDistrict.region} Region • {hoveredDistrict.area_sqkm.toLocaleString()} km²
              </div>
              <div className="text-[11px] text-[#858B87]">
                Population: {(hoveredDistrict.population / 100000).toFixed(1)} Lakhs • {hoveredDistrict.urban_pct}% Urban
              </div>
            </div>
          )}
        </div>

        {/* Right Info Box & Taluk Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2DDD5] p-5 shadow-2xs space-y-4">
          <div className="border-b border-[#E2DDD5] pb-3 flex items-center justify-between">
            <h3 className="text-xs font-heading font-bold text-[#1F2421] uppercase tracking-wider flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-[#9E3A26]" />
              <span>District Profile</span>
            </h3>
            {currentSelectedShape && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#9E3A26]/10 text-[#9E3A26] border border-[#9E3A26]/20">
                {currentSelectedShape.region} TN
              </span>
            )}
          </div>

          {currentSelectedShape ? (
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#858B87]">Selected District</span>
                <div className="text-xl font-heading font-extrabold text-[#1F2421] mt-0.5">
                  {currentSelectedShape.name}
                </div>
              </div>

              <p className="text-xs text-[#5E6460] leading-relaxed bg-[#FAF9F5] p-3 rounded-lg border border-[#E2DDD5]">
                {currentSelectedShape.description}
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5]">
                  <span className="text-[#858B87] text-[10px] block font-semibold">Total Area</span>
                  <div className="text-sm font-bold text-[#1F2421] font-mono mt-0.5">
                    {currentSelectedShape.area_sqkm.toLocaleString()} km²
                  </div>
                </div>

                <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5]">
                  <span className="text-[#858B87] text-[10px] block font-semibold">Population</span>
                  <div className="text-sm font-bold text-[#1F2421] font-mono mt-0.5">
                    {(currentSelectedShape.population / 100000).toFixed(1)} Lakhs
                  </div>
                </div>

                <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5]">
                  <span className="text-[#858B87] text-[10px] block font-semibold">Urban Share</span>
                  <div className="text-sm font-bold text-[#2D5A3D] font-mono mt-0.5">
                    {currentSelectedShape.urban_pct}%
                  </div>
                </div>

                <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5]">
                  <span className="text-[#858B87] text-[10px] block font-semibold">HQ</span>
                  <div className="text-sm font-bold text-[#1F2421] mt-0.5">
                    {currentSelectedShape.hq}
                  </div>
                </div>
              </div>

              {/* Taluks / Sub-Areas list */}
              <div className="space-y-1.5 pt-2 border-t border-[#E2DDD5]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2421] text-xs">
                    Taluks in {currentSelectedShape.name}:
                  </span>
                  <span className="text-[10px] text-[#858B87]">
                    {currentSelectedShape.taluks?.length || 0} Taluks
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {currentSelectedShape.taluks?.map((tname) => {
                    const isTalukActive = selectedTaluk === tname;
                    return (
                      <button
                        key={tname}
                        onClick={() => onSelectTaluk(tname)}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all ${
                          isTalukActive
                            ? 'bg-[#9E3A26] text-white font-bold shadow-2xs'
                            : 'bg-[#FAF9F5] hover:bg-[#F5F2EA] text-[#1F2421] border border-[#E2DDD5]'
                        }`}
                      >
                        {tname}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedTaluk && (
                <div className="p-3 bg-[#2D5A3D]/8 rounded-lg border border-[#2D5A3D]/20 text-xs text-[#1F432B] space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A3D]" />
                    <span>Active Taluk: {selectedTaluk}</span>
                  </div>
                  <p className="text-[11px] text-[#5E6460]">
                    Sub-district focus locked. Ready for land-use change detection and conversion risk forecasting.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-[#858B87] text-xs space-y-2">
              <MapPin className="w-8 h-8 text-[#D8D2C6] mx-auto" />
              <p className="font-bold text-[#1F2421]">Click any district on the 3D map</p>
              <p className="text-[11px] text-[#5E6460]">
                Each district displays its authentic real boundary shape with separated lines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
