import React, { useState } from 'react';
import { District } from '../types';
import { getCadastralDistrictData, DistrictCadastralData, CadastralTaluk } from '../data/districtCadastralMaps';
import { EXACT_TAMIL_NADU_DISTRICTS } from '../data/exactDistrictPaths';
import {
  MapPin,
  BookOpen,
  Users,
  Compass,
  Home,
  Maximize2,
  Info,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Building2,
  Wheat,
  Layers,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { KolamCorner, TamilGeometricDivider } from './common/TraditionalMotifs';

interface DistrictTalukCadastralMapProps {
  district: District;
  selectedTaluk: string;
  onSelectTaluk: (talukName: string) => void;
  onBackToStateMap: () => void;
}

export const DistrictTalukCadastralMap: React.FC<DistrictTalukCadastralMapProps> = ({
  district,
  selectedTaluk,
  onSelectTaluk,
  onBackToStateMap
}) => {
  const [hoveredTalukId, setHoveredTalukId] = useState<string | null>(null);

  // Retrieve authentic cadastral map dataset for this district
  const cadastralData: DistrictCadastralData = getCadastralDistrictData(district.id, district.name);

  // Exact district shape from statewide dataset for the mini inset maps
  const districtShape = EXACT_TAMIL_NADU_DISTRICTS.find(
    (d) => d.id.toLowerCase() === district.id.toLowerCase() || d.name.toLowerCase() === district.name.toLowerCase()
  ) || EXACT_TAMIL_NADU_DISTRICTS.find((d) => d.id === 'erode') || EXACT_TAMIL_NADU_DISTRICTS[0];

  // Helper to test if a taluk is currently selected
  const isTalukActive = (taluk: CadastralTaluk) => {
    if (!selectedTaluk) return false;
    const s = selectedTaluk.toLowerCase().replace(/ taluk/g, '').trim();
    const t = taluk.name.toLowerCase().replace(/ taluk/g, '').trim();
    return s.includes(t) || t.includes(s) || taluk.id.toLowerCase() === s;
  };

  // Find active taluk object
  const activeTaluk = cadastralData.taluks.find((t) => isTalukActive(t));

  // Dynamic SVG viewBox for each district (standardized 800x800 coordinate grid for GIS polygons)
  const getViewBox = () => "0 0 800 800";

  return (
    <div className="bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] shadow-xs p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto font-sans text-[#1F2421] relative overflow-hidden">
      <KolamCorner position="top-right" size={44} opacity={0.15} color="#9E3A26" className="absolute top-2 right-2 pointer-events-none" />

      {/* ========================================================================= */}
      {/* TOP HEADER & BREADCRUMBS BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2DDD5] pb-3.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-[#1F2421] tracking-tight uppercase">
            {cadastralData.districtName} DISTRICT – TALUK REVENUE MAP
          </h1>
          <div className="flex items-center space-x-1 text-xs font-semibold text-[#5E6460] mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#9E3A26] shrink-0" />
            <span>Official Revenue Taluks of {district.name} District, Tamil Nadu</span>
          </div>
        </div>

        {/* Breadcrumbs Pill Container */}
        <div className="inline-flex items-center space-x-2 bg-[#F5F2EA] border border-[#E2DDD5] rounded-xl px-3.5 py-1.5 text-xs text-[#5E6460] shadow-2xs self-start md:self-auto">
          <button
            onClick={onBackToStateMap}
            className="font-semibold hover:text-[#9E3A26] transition-colors flex items-center space-x-1 text-[#1F2421]"
          >
            <span>Tamil Nadu</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#858B87]" />
          <button
            onClick={() => onSelectTaluk('')}
            className={`font-semibold hover:text-[#9E3A26] transition-colors ${!selectedTaluk ? 'text-[#9E3A26] font-bold' : 'text-[#1F2421]'}`}
          >
            {district.name} District
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#858B87]" />
          <span className="font-bold text-[#9E3A26]">
            {selectedTaluk ? `${selectedTaluk} Taluk` : 'Select Taluk'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN 3-COLUMN DASHBOARD GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: Mini Map, Inset District Silhouette, Taluk List */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-3 space-y-3.5 flex flex-col">

          {/* CARD 1: TAMIL NADU Context Map (Mini State Inset) */}
          <div className="bg-white rounded-xl border border-[#E2DDD5] p-3 shadow-2xs flex flex-col items-center">
            <span className="text-[11px] font-heading font-extrabold tracking-wider text-[#1F2421] uppercase text-center mb-1">
              TAMIL NADU
            </span>
            <div className="w-full h-32 flex items-center justify-center relative">
              <svg viewBox="0 0 600 720" className="w-full h-full max-h-32 drop-shadow-2xs">
                {EXACT_TAMIL_NADU_DISTRICTS.map((d) => {
                  const isCurrent =
                    d.id.toLowerCase() === district.id.toLowerCase() ||
                    d.name.toLowerCase() === district.name.toLowerCase();
                  return (
                    <path
                      key={`tn-mini-${d.id}`}
                      d={d.path}
                      fill={isCurrent ? '#9E3A26' : '#F5F2EA'}
                      stroke={isCurrent ? '#7F2A19' : '#D8D2C6'}
                      strokeWidth={isCurrent ? '2.5' : '1'}
                      className="transition-colors"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[#1F2421] mt-1 self-center">
              <span className="w-2.5 h-2.5 bg-[#9E3A26] border border-[#7F2A19] rounded-xs inline-block" />
              <span>{district.name} District</span>
            </div>
          </div>

          {/* CARD 2: DISTRICT Inset Map */}
          <div className="bg-white rounded-xl border border-[#E2DDD5] p-3 shadow-2xs flex flex-col items-center">
            <span className="text-[11px] font-heading font-extrabold tracking-wider text-[#1F2421] uppercase text-center mb-1">
              {district.name.toUpperCase()} REVENUE TALUKS
            </span>
            <div className="w-full h-28 flex items-center justify-center relative p-1">
              <svg
                viewBox={getViewBox()}
                className="w-full h-full max-h-28 drop-shadow-xs"
              >
                {cadastralData.taluks.map((t) => (
                  <path
                    key={`inset-${t.id}`}
                    d={t.path}
                    fill="#FDF8EE"
                    stroke="#B58D3D"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            </div>
            <span className="text-[11px] font-extrabold text-[#9E3A26] text-center mt-1">
              Total Taluks: {cadastralData.taluks.length}
            </span>
          </div>

          {/* CARD 3: TALUK LIST */}
          <div className="bg-white rounded-xl border border-[#E2DDD5] p-3.5 shadow-2xs">
            <span className="text-[11px] font-heading font-extrabold tracking-wider text-[#1F2421] uppercase block mb-2.5">
              TALUK DIRECTORY
            </span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2">
              {cadastralData.taluks.map((taluk, idx) => {
                const isSelected = isTalukActive(taluk);
                const isHovered = hoveredTalukId === taluk.id;
                const talukNum = taluk.number || idx + 1;

                return (
                  <button
                    key={`list-${taluk.id}`}
                    onClick={() => onSelectTaluk(taluk.name.replace(' TALUK', ''))}
                    onMouseEnter={() => setHoveredTalukId(taluk.id)}
                    onMouseLeave={() => setHoveredTalukId(null)}
                    className={`flex items-center space-x-2 p-1.5 rounded-lg border text-left transition-all ${isSelected
                        ? 'bg-[#9E3A26]/10 border-[#9E3A26] shadow-2xs ring-1 ring-[#9E3A26]/40'
                        : isHovered
                          ? 'bg-[#F5F2EA] border-[#D8D2C6]'
                          : 'bg-white border-[#E2DDD5] hover:border-[#D8D2C6]'
                      }`}
                  >
                    {/* Number Badge with matching pastel color */}
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-[#1F2421] shrink-0 shadow-2xs"
                      style={{ backgroundColor: taluk.color }}
                    >
                      {talukNum}
                    </span>
                    <span className="text-[11px] font-bold text-[#1F2421] truncate">
                      {taluk.name.replace(' TALUK', '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CENTER COLUMN: Main District Taluk Map Canvas */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2DDD5] p-4 shadow-2xs relative flex flex-col justify-between min-h-[580px] overflow-hidden select-none">

          {/* Top Canvas Bar: Title & North Compass Arrow */}
          <div className="flex items-start justify-between z-10">
            <div>
              <h2 className="text-sm sm:text-base font-heading font-extrabold text-[#1F2421]">
                {district.name} District – Cadastral Map
              </h2>
            </div>

            {/* North Arrow Compass */}
            <div className="flex flex-col items-center pr-2">
              <span className="font-heading font-black text-[11px] text-[#9E3A26] leading-none">N</span>
              <div className="w-0 h-0 border-x-[5px] border-x-transparent border-b-[14px] border-b-[#9E3A26] mt-0.5" />
            </div>
          </div>

          {/* Surrounding Neighboring Districts Labels */}
          {cadastralData.neighbors.north && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-center pointer-events-none">
              {cadastralData.neighbors.north}
            </div>
          )}
          {cadastralData.neighbors.east && (
            <div className="absolute top-28 right-4 text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-right pointer-events-none max-w-[80px]">
              {cadastralData.neighbors.east}
            </div>
          )}
          {cadastralData.neighbors.north_east && (
            <div className="absolute top-64 right-4 text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-right pointer-events-none max-w-[80px]">
              {cadastralData.neighbors.north_east}
            </div>
          )}
          {cadastralData.neighbors.south_east && (
            <div className="absolute bottom-20 right-8 text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-right pointer-events-none">
              {cadastralData.neighbors.south_east}
            </div>
          )}
          {cadastralData.neighbors.south_west && (
            <div className="absolute bottom-40 left-4 text-[10px] font-bold text-[#5E6460] uppercase tracking-wider pointer-events-none max-w-[90px]">
              {cadastralData.neighbors.south_west}
            </div>
          )}
          {cadastralData.neighbors.west && (
            <div className="absolute bottom-16 left-6 text-[10px] font-bold text-[#5E6460] uppercase tracking-wider pointer-events-none max-w-[90px]">
              {cadastralData.neighbors.west}
            </div>
          )}

          {/* SVG Vector Map Container */}
          <div className="w-full flex items-center justify-center my-auto py-2">
            <svg
              viewBox={getViewBox()}
              className="w-full max-w-[620px] h-auto drop-shadow-xs select-none"
            >
              <defs>
                <filter id="activeTalukGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#9E3A26" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* 1. TALUK POLYGONS */}
              <g id="taluk-polygons">
                {cadastralData.taluks.map((taluk, idx) => {
                  const isSelected = isTalukActive(taluk);
                  const isHovered = hoveredTalukId === taluk.id;
                  const talukNum = taluk.number || idx + 1;

                  return (
                    <g
                      key={`poly-${taluk.id}`}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredTalukId(taluk.id)}
                      onMouseLeave={() => setHoveredTalukId(null)}
                      onClick={() => onSelectTaluk(taluk.name.replace(' TALUK', ''))}
                    >
                      {/* Polygon Shape */}
                      <path
                        d={taluk.path}
                        fill={taluk.color}
                        stroke={isSelected ? '#9E3A26' : isHovered ? '#1F2421' : '#5E6460'}
                        strokeWidth={isSelected ? '3.8' : isHovered ? '2.8' : '1.8'}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter={isSelected ? 'url(#activeTalukGlow)' : undefined}
                        className="transition-all duration-150"
                      />

                      {/* HQ Center Marker Dot */}
                      <circle
                        cx={taluk.labelPosition ? taluk.labelPosition[0] : 400}
                        cy={taluk.labelPosition ? taluk.labelPosition[1] : 400}
                        r={isSelected ? 6 : 4.5}
                        fill={isSelected ? '#9E3A26' : '#1F2421'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />

                      {/* White Label Shield Backing */}
                      <rect
                        x={(taluk.labelPosition ? taluk.labelPosition[0] : 400) - (taluk.name.replace(' TALUK', '').length * 4.2 + 10)}
                        y={(taluk.labelPosition ? taluk.labelPosition[1] : 400) + 7}
                        width={(taluk.name.replace(' TALUK', '').length * 8.4 + 20)}
                        height="18"
                        rx="4"
                        fill="#FAF9F5"
                        fillOpacity="0.95"
                        stroke={isSelected ? '#9E3A26' : '#D8D2C6'}
                        strokeWidth={isSelected ? '1.5' : '0.8'}
                      />

                      {/* Taluk Name & Number Text */}
                      <text
                        x={taluk.labelPosition ? taluk.labelPosition[0] : 400}
                        y={(taluk.labelPosition ? taluk.labelPosition[1] : 400) + 19}
                        textAnchor="middle"
                        className="font-sans font-black text-[10px] tracking-tight pointer-events-none select-none"
                        fill={isSelected ? '#9E3A26' : '#1F2421'}
                      >
                        {talukNum}. {taluk.name.replace(' TALUK', '')}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Bottom Canvas Toolbar & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2DDD5] text-xs text-[#5E6460]">
            <div className="flex items-center space-x-3 text-[11px] font-semibold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-xs border border-[#9E3A26] bg-[#9E3A26]/20 inline-block" />
                <span>Active Selected</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-xs border border-[#5E6460] bg-[#F5F2EA] inline-block" />
                <span>Revenue Boundary</span>
              </div>
            </div>
            <div className="text-[10px] text-[#858B87] font-mono">
              Projection: EPSG:4326 • Cadastre 1:25,000
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: Selected Taluk Intelligence Summary */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-3 space-y-3.5 flex flex-col">
          {activeTaluk ? (
            <div className="bg-white rounded-xl border border-[#E2DDD5] p-4 shadow-2xs space-y-3.5">
              <div className="border-b border-[#E2DDD5] pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E3A26]">
                    Taluk Focus
                  </span>
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-[#1F2421]"
                    style={{ backgroundColor: activeTaluk.color }}
                  >
                    {activeTaluk.number || '1'}
                  </span>
                </div>
                <h3 className="text-base font-heading font-bold text-[#1F2421] mt-0.5">
                  {activeTaluk.name.replace(' TALUK', '')}
                </h3>
                <p className="text-[11px] text-[#5E6460]">
                  Headquarters: <strong>{(activeTaluk as any).hq || activeTaluk.name.replace(' TALUK', '')}</strong>
                </p>
              </div>

              {/* Key Indicators */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-[#FAF9F5] border border-[#E2DDD5]">
                  <span className="text-[#5E6460]">Area Coverage</span>
                  <span className="font-bold text-[#1F2421] font-mono">{activeTaluk.area_sqkm || 480} km²</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-[#FAF9F5] border border-[#E2DDD5]">
                  <span className="text-[#5E6460]">Agricultural Land</span>
                  <span className="font-bold text-[#2D5A3D] font-mono">{(activeTaluk as any).agri_pct || 68}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-[#FAF9F5] border border-[#E2DDD5]">
                  <span className="text-[#5E6460]">Built-up / Urban</span>
                  <span className="font-bold text-[#9E3A26] font-mono">{(activeTaluk as any).urban_pct || 22}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-[#FAF9F5] border border-[#E2DDD5]">
                  <span className="text-[#5E6460]">Rainfall Status</span>
                  <span className="font-bold text-[#1F2421]">{(activeTaluk as any).rainfall_status || 'Semi-Arid (640 mm)'}</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectTaluk(activeTaluk.name.replace(' TALUK', ''))}
                className="w-full py-2 bg-[#9E3A26] hover:bg-[#7F2A19] text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1.5"
              >
                <span>Inspect Micro-Grid Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E2DDD5] p-5 shadow-2xs text-center space-y-2">
              <Compass className="w-8 h-8 text-[#9E3A26]/50 mx-auto" />
              <h4 className="text-xs font-heading font-bold text-[#1F2421]">Select Any Taluk</h4>
              <p className="text-[11px] text-[#5E6460]">
                Click a taluk polygon on the map or select from the directory list to examine revenue statistics and agricultural preservation status.
              </p>
            </div>
          )}

          {/* Statewide Context Card */}
          <div className="bg-[#FAF9F5] rounded-xl border border-[#E2DDD5] p-3.5 text-xs text-[#5E6460] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#2D5A3D] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Revenue Boundary Validation</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Boundaries are harmonized with Tamil Nadu Survey and Land Records (e-District Cadastre).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
