import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LulcComparisonItem, TransitionMatrixRow, KeyTransitionItem } from '../types';
import {
  GitCommit,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  Wheat,
  Building2
} from 'lucide-react';
import {
  KolamCorner,
  TamilGeometricDivider,
  TamilEmblemBadge,
  AgriculturalEriScene,
  DualSegmentBarMeter
} from '../components/common/TraditionalMotifs';

interface LulcChangePageProps {
  onNavigateTab: (tab: any) => void;
}

export const LulcChangePage: React.FC<LulcChangePageProps> = ({ onNavigateTab }) => {
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState<LulcComparisonItem[]>([]);
  const [matrix, setMatrix] = useState<TransitionMatrixRow[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [keyTransitions, setKeyTransitions] = useState<KeyTransitionItem[]>([]);
  const [selectedTransition, setSelectedTransition] = useState<KeyTransitionItem | null>(null);

  useEffect(() => {
    Promise.all([
      api.getLulcSummary(),
      api.getLulcChange()
    ])
      .then(([sumRes, changeRes]) => {
        setComparison(sumRes.comparison);
        setMatrix(changeRes.matrix);
        setClasses(changeRes.classes);
        setKeyTransitions(changeRes.key_transitions);
        if (changeRes.key_transitions.length > 0) {
          setSelectedTransition(changeRes.key_transitions[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-[#5E6460] font-sans text-sm flex flex-col items-center justify-center space-y-3">
        <Layers className="w-10 h-10 text-[#C04A26] animate-pulse" />
        <p className="font-serif font-bold text-[#1A1F1C]">Computing 5-Year LULC Transition Dynamics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header with Traditional Motifs */}
      <div className="relative bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E2DDD5] shadow-xs overflow-hidden">
        <KolamCorner position="top-right" size={54} color="#D49B28" opacity={0.3} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <TamilEmblemBadge size={46} className="shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1F1C] tracking-wide">
                  Land Use / Land Cover (LULC) Change Analytics
                </h1>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#C04A26]/10 text-[#C04A26] border border-[#C04A26]/25">
                  2018 → 2023 Multi-Temporal
                </span>
              </div>
              <p className="text-xs text-[#5E6460] mt-1 max-w-3xl leading-relaxed">
                Multi-temporal satellite-derived conversion dynamics across Tiruppur District, Tamil Nadu.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('gis')}
            className="px-4 py-2 bg-white hover:bg-[#F5EFE6] text-[#C04A26] rounded-xl text-xs font-bold transition-all border border-[#E2DDD5] shadow-xs flex items-center space-x-1.5 self-start md:self-auto"
          >
            <span>View on GIS Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <TamilGeometricDivider className="mt-5 text-[#D49B28]" />
      </div>

      {/* Summary Cards with Visual Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparison.map((c) => {
          const isNegative = c.net_change_ha < 0;
          return (
            <div key={c.lulc_class} className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col justify-between space-y-2 group hover:border-[#C04A26]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5E6460] uppercase tracking-wider">{c.lulc_class}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isNegative ? 'bg-[#C04A26]/10 text-[#C04A26]' : 'bg-[#1E6B48]/10 text-[#1E6B48]'
                }`}>
                  {c.pct_2023}% of total
                </span>
              </div>
              <div className="text-2xl font-mono font-extrabold text-[#1A1F1C]">
                {c.area_2023_ha.toLocaleString()} ha
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#E2DDD5]/60 text-xs">
                <div className="flex items-center space-x-1">
                  {isNegative ? (
                    <TrendingDown className="w-4 h-4 text-[#C04A26]" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-[#1E6B48]" />
                  )}
                  <span className={isNegative ? 'text-[#C04A26] font-bold font-mono' : 'text-[#1E6B48] font-bold font-mono'}>
                    {c.net_change_ha > 0 ? `+${c.net_change_ha}` : c.net_change_ha} ha ({c.net_change_pct}%)
                  </span>
                </div>
                <span className="text-[#858B87] text-[10px]">vs 2018</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* LULC Transition Matrix */}
      <div className="bg-[#FAF9F5] p-6 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-4 relative overflow-hidden">
        <KolamCorner position="top-right" size={36} opacity={0.15} color="#1E6B48" className="absolute top-2 right-2 pointer-events-none" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-serif font-bold text-[#1A1F1C]">
              LULC Transition Matrix (2018 Baseline → 2023 Current)
            </h2>
            <p className="text-[11px] text-[#5E6460]">
              Values in Hectares (Rows = 2018 class, Columns = 2023 class). Highlights diagonal retention vs cross-conversion.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#858B87]">Unit: Hectares (ha)</span>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-[#E2DDD5] shadow-2xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#FAF9F5] text-[#5E6460] uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3.5 border-b border-r border-[#E2DDD5]">2018 Class \ 2023 Class</th>
                {classes.map((col) => (
                  <th key={col} className="p-3.5 border-b border-r border-[#E2DDD5] text-right">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="p-3.5 font-serif font-bold text-[#1A1F1C] border-b border-r border-[#E2DDD5] bg-[#FAF9F5]">
                    {row.from_class}
                  </td>
                  {classes.map((col) => {
                    const val = Number(row[col]) || 0;
                    const isDiagonal = row.from_class === col;
                    const isAgriToBuilt = row.from_class === 'Agriculture' && col === 'Built-up';
                    return (
                      <td
                        key={col}
                        className={`p-3.5 border-b border-r border-[#E2DDD5] text-right font-mono ${
                          isAgriToBuilt
                            ? 'bg-[#C04A26]/12 text-[#C04A26] font-bold ring-1 ring-inset ring-[#C04A26]/30'
                            : isDiagonal
                            ? 'bg-[#1E6B48]/8 text-[#155034] font-semibold'
                            : 'text-[#5E6460]'
                        }`}
                      >
                        {val.toLocaleString()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#5E6460] pt-2 border-t border-[#E2DDD5]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-[#C04A26]/20 border border-[#C04A26] inline-block" />
              <span>Critical Conversion Corridor (Agri → Built-up)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-[#1E6B48]/20 border border-[#1E6B48] inline-block" />
              <span>Stable Retained Land Use</span>
            </span>
          </div>
          <span className="font-semibold text-[#1A1F1C]">Total evaluated sample: ~8,000 ha</span>
        </div>
      </div>

      {/* Key Transition Spotlight with Agricultural Scene Artwork */}
      {selectedTransition && (
        <div className="bg-white p-6 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute right-4 bottom-1 w-1/3 opacity-15 pointer-events-none hidden md:block">
            <AgriculturalEriScene />
          </div>

          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#C04A26]" />
            <h3 className="text-sm font-serif font-bold text-[#C04A26] uppercase tracking-wider">
              Primary Transition Focus: {selectedTransition.transition}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs relative z-10">
            <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] space-y-1">
              <span className="text-[#5E6460] font-medium">Converted Agricultural Area:</span>
              <div className="text-xl font-mono font-black text-[#C04A26]">
                {selectedTransition.area_ha.toLocaleString()} ha
              </div>
              <p className="text-[11px] text-[#858B87]">
                {selectedTransition.pct_of_original_agri}% of baseline agricultural extent
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] space-y-1">
              <span className="text-[#5E6460] font-medium">Identified Geographic Hotspots:</span>
              <ul className="list-disc list-inside text-[#1A1F1C] text-[11px] space-y-1 mt-1">
                {selectedTransition.hotspots.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] space-y-1">
              <span className="text-[#5E6460] font-medium">Primary Socio-Economic Drivers:</span>
              <ul className="list-disc list-inside text-[#1A1F1C] text-[11px] space-y-1 mt-1">
                {selectedTransition.drivers.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
