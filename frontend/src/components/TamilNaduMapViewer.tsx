import React, { useState } from 'react';
import { District } from '../types';
import {
  MapPin,
  Info,
  ChevronRight,
  ExternalLink,
  Compass,
  Building2,
  Wheat,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { KolamCorner } from './common/TraditionalMotifs';

interface TamilNaduMapViewerProps {
  districts: District[];
  selectedDistrict: District | null;
  selectedTaluk: string;
  onSelectDistrict: (district: District) => void;
  onSelectTaluk: (taluk: string) => void;
  onOpenGisMicroView: () => void;
  onOpenResearch: () => void;
}

// Convert lon/lat to SVG coordinates (Width 600, Height 750)
function projectCoord(lon: number, lat: number): [number, number] {
  const minLon = 76.1;
  const maxLon = 80.4;
  const minLat = 8.0;
  const maxLat = 13.6;

  const x = Math.round(((lon - minLon) / (maxLon - minLon)) * 520 + 40);
  const y = Math.round(((maxLat - lat) / (maxLat - minLat)) * 680 + 35);
  return [x, y];
}

// Generate stylized boundary polygon paths for all 38 districts
function getDistrictPath(d: District): string {
  const [cx, cy] = projectCoord(d.lon || 77.5, d.lat || 11.0);
  const r = Math.max(22, Math.min(48, Math.round(Math.sqrt(d.area_sqkm) * 0.45)));

  const points: [number, number][] = [];
  const numPoints = 8;
  const seed = (d.id.charCodeAt(0) + d.id.charCodeAt(d.id.length - 1)) % 5;

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const varR = r * (0.85 + 0.25 * Math.sin(angle * 2 + seed));
    const px = Math.round(cx + varR * Math.cos(angle) * 1.05);
    const py = Math.round(cy + varR * Math.sin(angle) * 0.95);
    points.push([px, py]);
  }

  return `M ${points.map((p) => `${p[0]},${p[1]}`).join(' L ')} Z`;
}

export const TamilNaduMapViewer: React.FC<TamilNaduMapViewerProps> = ({
  districts,
  selectedDistrict,
  selectedTaluk,
  onSelectDistrict,
  onSelectTaluk,
  onOpenGisMicroView,
  onOpenResearch
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

  return (
    <div className="bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] shadow-2xs p-6 space-y-6 relative overflow-hidden">
      <KolamCorner position="top-right" size={36} opacity={0.15} color="#9E3A26" className="absolute top-2 right-2" />

      {/* Top Header & Dropdown Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD5]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A3D] animate-pulse" />
            <h2 className="text-lg font-heading font-extrabold text-[#1F2421]">
              Tamil Nadu State Map (38 Districts)
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#9E3A26]/10 text-[#9E3A26] border border-[#9E3A26]/20">
              Interactive Boundary Map
            </span>
          </div>
          <p className="text-xs text-[#5E6460] mt-0.5">
            Hover and click any district to inspect, or pick a district and area directly from the dropdown below.
          </p>
        </div>

        {/* Action button */}
        {selectedDistrict && (
          <button
            onClick={() => onSelectDistrict(null as any)}
            className="px-3 py-1.5 rounded-lg border border-[#E2DDD5] hover:bg-[#F5F2EA] text-[#1F2421] text-xs font-semibold flex items-center space-x-1.5 transition-all self-start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#9E3A26]" />
            <span>Reset Map View</span>
          </button>
        )}
      </div>

      {/* Dropdown Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-[#E2DDD5] text-xs">
        <div className="space-y-1">
          <label className="font-bold text-[#1F2421] block">
            1. Select District ({districts.length} Districts):
          </label>
          <select
            value={selectedDistrict?.id || ''}
            onChange={(e) => {
              const d = districts.find((dist) => dist.id === e.target.value);
              if (d) onSelectDistrict(d);
              onSelectTaluk('');
            }}
            className="w-full bg-[#FAF9F5] border border-[#E2DDD5] rounded-lg px-3 py-2 font-semibold text-[#1F2421] focus:ring-1 focus:ring-[#9E3A26] focus:outline-hidden cursor-pointer"
          >
            <option value="">-- Choose from 38 Districts --</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.region} Region)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-[#1F2421] block">
            2. Select Area / Taluk:
          </label>
          <select
            value={selectedTaluk}
            onChange={(e) => onSelectTaluk(e.target.value)}
            disabled={!selectedDistrict}
            className={`w-full border rounded-lg px-3 py-2 font-semibold focus:ring-1 focus:ring-[#9E3A26] focus:outline-hidden cursor-pointer ${
              selectedDistrict
                ? 'bg-[#FAF9F5] border-[#E2DDD5] text-[#1F2421]'
                : 'bg-[#F5F2EA] border-[#E2DDD5] text-[#858B87] cursor-not-allowed'
            }`}
          >
            <option value="">
              {selectedDistrict ? `-- All Areas in ${selectedDistrict.name} --` : '-- Choose a District First --'}
            </option>
            {selectedDistrict?.taluks?.map((tname) => (
              <option key={tname} value={tname}>
                {tname} Taluk
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: SVG Map Left (8 cols) + Info Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: SVG Map Canvas */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-[#E2DDD5] p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xs min-h-[580px]">
          <svg
            viewBox="0 0 600 750"
            className="w-full max-w-[500px] h-auto drop-shadow-xs select-none"
          >
            {/* Background State Outline */}
            <g id="state-districts">
              {districts.map((d) => {
                const isSelected = selectedDistrict?.id === d.id;
                const isHovered = hoveredDistrict?.id === d.id;
                const pathStr = getDistrictPath(d);
                const [cx, cy] = projectCoord(d.lon || 77.5, d.lat || 11.0);

                return (
                  <g
                    key={d.id}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={() => setHoveredDistrict(d)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onClick={() => {
                      onSelectDistrict(d);
                      onSelectTaluk('');
                    }}
                  >
                    <path
                      d={pathStr}
                      fill={
                        isSelected
                          ? '#9E3A26'
                          : isHovered
                          ? '#FDF8EE'
                          : '#FAF9F5'
                      }
                      stroke={
                        isSelected
                          ? '#7F2A19'
                          : isHovered
                          ? '#B58D3D'
                          : '#D8D2C6'
                      }
                      strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1'}
                      className="transition-colors duration-150"
                    />
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isSelected ? '9' : '7.5'}
                      fontWeight={isSelected ? 'bold' : '600'}
                      fill={isSelected ? '#FFFFFF' : '#1F2421'}
                      className="pointer-events-none select-none tracking-tight font-sans"
                    >
                      {d.name.length > 8 ? d.name.substring(0, 7) + '..' : d.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredDistrict && (
            <div className="absolute bottom-4 right-4 z-20 bg-[#FAF9F5]/95 backdrop-blur-md text-[#1F2421] text-xs p-3 rounded-xl shadow-lg border border-[#E2DDD5] pointer-events-none space-y-1">
              <div className="font-heading font-bold text-sm text-[#9E3A26]">{hoveredDistrict.name} District</div>
              <div className="text-[11px] text-[#5E6460]">
                {hoveredDistrict.region} Region • {hoveredDistrict.area_sqkm.toLocaleString()} km²
              </div>
              <div className="text-[11px] text-[#858B87]">
                Pop: {(hoveredDistrict.population / 100000).toFixed(1)} Lakhs • {hoveredDistrict.urban_pct}% Urban
              </div>
            </div>
          )}
        </div>

        {/* Right: Selected District Profile Card */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {selectedDistrict ? (
            <div className="bg-white rounded-2xl border border-[#E2DDD5] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E3A26]">
                    Selected District
                  </span>
                  <h3 className="text-xl font-heading font-black text-[#1F2421]">
                    {selectedDistrict.name}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#9E3A26]/10 text-[#9E3A26] border border-[#9E3A26]/20">
                  {selectedDistrict.region} TN
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#5E6460] leading-relaxed bg-[#FAF9F5] p-3 rounded-lg border border-[#E2DDD5]">
                {selectedDistrict.description}
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5]">
                  <span className="text-[#858B87] text-[10px] block font-semibold">Total Area</span>
                  <div className="text-base font-bold text-[#1F2421] font-mono mt-0.5">
                    {selectedDistrict.area_sqkm.toLocaleString()} km²
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5]">
                  <span className="text-[#858B87] text-[10px] block font-semibold">Total Population</span>
                  <div className="text-base font-bold text-[#1F2421] font-mono mt-0.5">
                    {(selectedDistrict.population / 100000).toFixed(1)} Lakhs
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5]">
                  <span className="text-[#858B87] text-[10px] block font-semibold">Urban Share</span>
                  <div className="text-base font-bold text-[#2D5A3D] font-mono mt-0.5">
                    {selectedDistrict.urban_pct}%
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5]">
                  <span className="text-[#858B87] text-[10px] block font-semibold">Headquarters</span>
                  <div className="text-base font-bold text-[#1F2421] mt-0.5">
                    {selectedDistrict.hq}
                  </div>
                </div>
              </div>

              {/* Sub-Areas / Taluks in this District */}
              <div className="space-y-2 pt-2 border-t border-[#E2DDD5]">
                <span className="text-xs font-bold text-[#1F2421] flex items-center justify-between">
                  <span>Taluks in {selectedDistrict.name} ({selectedDistrict.taluks?.length || 0})</span>
                  <span className="text-[10px] text-[#858B87] font-normal">Click dropdown above to focus</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDistrict.taluks?.map((tname) => {
                    const isTalukActive = selectedTaluk === tname;
                    return (
                      <button
                        key={tname}
                        onClick={() => onSelectTaluk(tname)}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all ${
                          isTalukActive
                            ? 'bg-[#9E3A26] text-white shadow-2xs font-bold'
                            : 'bg-[#FAF9F5] text-[#1F2421] border border-[#E2DDD5] hover:bg-[#F5F2EA]'
                        }`}
                      >
                        {tname}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E2DDD5] space-y-2">
                <button
                  onClick={onOpenGisMicroView}
                  className="w-full py-2.5 bg-[#2D5A3D] hover:bg-[#1F432B] text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open GIS Explorer &amp; Risk Parcels</span>
                </button>

                <button
                  onClick={onOpenResearch}
                  className="w-full py-2 bg-[#F5F2EA] hover:bg-[#EFECE6] text-[#1F2421] border border-[#E2DDD5] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-[#9E3A26]" />
                  <span>Ask Research Copilot for {selectedDistrict.name}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2DDD5] p-8 text-center space-y-3 shadow-2xs">
              <Compass className="w-10 h-10 text-[#B58D3D] mx-auto" />
              <h3 className="text-base font-heading font-bold text-[#1F2421]">Select Any District</h3>
              <p className="text-xs text-[#5E6460] leading-relaxed">
                Click any of the 38 districts on the map or use the dropdown to inspect area statistics, taluks, and land-use pressure.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
