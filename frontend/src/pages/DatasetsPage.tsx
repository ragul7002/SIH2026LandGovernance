import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DatasetItem } from '../types';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sparkles,
  RefreshCw,
  FileCheck2,
  Server,
  Globe2
} from 'lucide-react';
import {
  KolamCorner,
  TamilGeometricDivider,
  TamilEmblemBadge,
  PalmLeafCartographyScene,
  RadialProgressRing,
  DualSegmentBarMeter
} from '../components/common/TraditionalMotifs';

export const DatasetsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [qualityStats, setQualityStats] = useState<{
    overall_platform_quality_index: number;
    average_completeness_pct: number;
    crs_standardization: string;
  }>({
    overall_platform_quality_index: 94.2,
    average_completeness_pct: 96.1,
    crs_standardization: 'EPSG:4326 (WGS 84)'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const qRes = await api.getDataQuality();
      setDatasets(qRes.datasets_status);
      setQualityStats({
        overall_platform_quality_index: qRes.overall_platform_quality_index,
        average_completeness_pct: qRes.average_completeness_pct,
        crs_standardization: 'EPSG:4326 (WGS 84)'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header with Tamil Emblem & Heritage Divider */}
      <div className="relative bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E2DDD5] shadow-xs overflow-hidden">
        <KolamCorner position="top-right" size={54} color="#D49B28" opacity={0.3} />
        
        {/* Subtle Palm Leaf Cartography Watermark */}
        <div className="absolute right-4 bottom-1 w-1/4 opacity-15 pointer-events-none hidden md:block">
          <PalmLeafCartographyScene />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <TamilEmblemBadge size={46} className="shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1F1C] tracking-wide">
                  Datasets &amp; Data Quality Management
                </h1>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#1E6B48]/10 text-[#1E6B48] border border-[#1E6B48]/25">
                  Verified Telemetry
                </span>
              </div>
              <p className="text-xs text-[#5E6460] mt-1 max-w-3xl leading-relaxed">
                Ingestion status, spatial/temporal resolution, licensing, and explicit data limitation notices for all ingested layers.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1A1F1C] bg-white px-3.5 py-2 rounded-xl border border-[#E2DDD5] shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#1E6B48]" />
            <span>Non-Sensitive Public &amp; Open Geospatial Data Only</span>
          </div>
        </div>

        <TamilGeometricDivider className="mt-5 text-[#D49B28]" />
      </div>

      {/* Quality Overview KPIs (Interactive Radial Rings & Split Meters) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Quality Index with Radial Ring */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs flex items-center justify-between group hover:border-[#1E6B48]/40 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#5E6460] uppercase tracking-wider block">
              Platform Quality Index
            </span>
            <div className="text-2xl font-mono font-extrabold text-[#1A1F1C]">
              {qualityStats.overall_platform_quality_index}/100
            </div>
            <span className="text-[11px] font-sans text-[#1E6B48] font-semibold block">
              Standardized across 5 source layers
            </span>
          </div>
          <RadialProgressRing
            value={qualityStats.overall_platform_quality_index}
            size={74}
            strokeWidth={7}
            color="#1E6B48"
            unit=""
            sublabel="/100"
          />
        </div>

        {/* KPI 2: Average Completeness with Radial Ring */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs flex items-center justify-between group hover:border-[#C04A26]/40 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#5E6460] uppercase tracking-wider block">
              Average Completeness
            </span>
            <div className="text-2xl font-mono font-extrabold text-[#1A1F1C]">
              {qualityStats.average_completeness_pct}%
            </div>
            <span className="text-[11px] font-sans text-[#C04A26] font-semibold block">
              Zero synthetic interpolation on truth
            </span>
          </div>
          <RadialProgressRing
            value={qualityStats.average_completeness_pct}
            size={74}
            strokeWidth={7}
            color="#C04A26"
            unit="%"
            sublabel="complete"
          />
        </div>

        {/* KPI 3: Spatial Standardization */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs flex items-center justify-between group hover:border-[#254E7A]/40 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#5E6460] uppercase tracking-wider block">
              Spatial Standardization
            </span>
            <div className="text-2xl font-mono font-extrabold text-[#1A1F1C]">
              EPSG:4326
            </div>
            <span className="text-[11px] font-sans text-[#5E6460] block">
              WGS 84 Geographic Coordinate System
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#254E7A]/10 text-[#254E7A] flex items-center justify-center border border-[#254E7A]/20">
            <Globe2 className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Ingestion Pipeline Architecture Banner */}
      <div className="p-6 bg-white rounded-2xl border border-[#E2DDD5] shadow-xs text-xs space-y-3">
        <div className="flex items-center space-x-2 font-serif font-bold text-[#1A1F1C] uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[#C04A26]" />
          <span>Standardized Ingestion Pipeline Flow</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#1A1F1C]/80">
          <span className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E2DDD5] rounded-xl font-semibold">Raw Public Connector</span>
          <span className="text-[#858B87]">→</span>
          <span className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E2DDD5] rounded-xl font-semibold">Schema Validation</span>
          <span className="text-[#858B87]">→</span>
          <span className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E2DDD5] rounded-xl font-semibold">CRS Standardization</span>
          <span className="text-[#858B87]">→</span>
          <span className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E2DDD5] rounded-xl font-semibold">Spatial Centroid Join</span>
          <span className="text-[#858B87]">→</span>
          <span className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E2DDD5] rounded-xl font-semibold">Feature Engineering</span>
          <span className="text-[#858B87]">→</span>
          <span className="px-3 py-1.5 bg-[#1E6B48]/12 border border-[#1E6B48]/30 text-[#1E6B48] rounded-xl font-bold">
            Audit Storage &amp; ML
          </span>
        </div>
      </div>

      {/* Datasets Table with Visual Completeness Bars */}
      <div className="bg-white rounded-3xl border border-[#E2DDD5] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2DDD5] flex items-center justify-between bg-[#FAF9F5]/70">
          <h2 className="text-xs font-serif font-bold text-[#1A1F1C] uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-[#D49B28]" />
            <span>Active Geospatial &amp; Environmental Registries</span>
          </h2>
          <span className="text-xs font-mono text-[#5E6460]">5 Layers Connected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] text-[#5E6460] uppercase font-bold text-[10px] border-b border-[#E2DDD5]">
              <tr>
                <th className="p-4">Dataset Name</th>
                <th className="p-4">Authority / Source</th>
                <th className="p-4">Resolution</th>
                <th className="p-4">Temporal Coverage</th>
                <th className="p-4">License</th>
                <th className="p-4">Completeness</th>
                <th className="p-4">Quality Score</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE7DF]">
              {datasets.map((d) => (
                <tr key={d.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  <td className="p-4 font-bold text-[#1A1F1C]">
                    <div>{d.name}</div>
                    {d.limitation_note && (
                      <div className="text-[10px] text-[#996B1E] mt-1 font-normal flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 shrink-0 text-[#D49B28]" />
                        <span>{d.limitation_note}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-[#5E6460]">{d.authority}</td>
                  <td className="p-4 font-mono text-[#1A1F1C]">{d.spatial_resolution}</td>
                  <td className="p-4 text-[#5E6460]">{d.temporal_coverage}</td>
                  <td className="p-4 text-[#5E6460]">{d.license}</td>
                  <td className="p-4">
                    <div className="space-y-1 w-28">
                      <div className="flex justify-between font-mono text-[10px] text-[#1E6B48] font-bold">
                        <span>{d.completeness_pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EFECE6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1E6B48] rounded-full"
                          style={{ width: `${d.completeness_pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-extrabold text-[#1A1F1C]">{d.quality_score}/100</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1E6B48]/10 text-[#1E6B48] border border-[#1E6B48]/25">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
