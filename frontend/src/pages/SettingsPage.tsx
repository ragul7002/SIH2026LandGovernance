import React from 'react';
import { UserRole } from '../types';
import {
  Shield,
  Globe,
  Lock,
  CheckCircle2,
  Server,
  MapPin,
  Compass,
  Activity,
  Zap,
  HardDrive,
  Cpu
} from 'lucide-react';
import {
  KolamCorner,
  TamilGeometricDivider,
  TamilEmblemBadge,
  TempleSkylineIllustration,
  RadialProgressRing,
  DualSegmentBarMeter
} from '../components/common/TraditionalMotifs';

interface SettingsPageProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header Banner with Temple Skyline Watermark */}
      <div className="relative bg-gradient-to-r from-[#FBF8F3] via-[#FAF5EC] to-[#F5EFE6] rounded-2xl p-6 border border-[#E2DDD5] shadow-xs overflow-hidden">
        <KolamCorner position="top-right" size={48} color="#D49B28" opacity={0.3} />
        <TempleSkylineIllustration className="absolute -right-6 -bottom-6 w-80 h-32 opacity-15 pointer-events-none text-[#C04A26]" />

        <div className="flex items-start gap-4 relative z-10">
          <TamilEmblemBadge size={48} className="shrink-0 mt-0.5 shadow-xs" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1F2421] tracking-wide">
                Platform Settings &amp; Governance Configuration
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1E6B48]/10 text-[#1E6B48] border border-[#1E6B48]/30">
                System Active
              </span>
            </div>
            <p className="text-xs text-[#5E6460] mt-1.5 max-w-3xl leading-relaxed">
              System parameters, user role permissions, Spatial CRS standards (EPSG:4326), and data privacy constraints under Tamil Nadu Governance guidelines.
            </p>
          </div>
        </div>

        <TamilGeometricDivider className="mt-4 text-[#D49B28] opacity-50" />
      </div>

      {/* Role & Access Controls (RBAC) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2DDD5] shadow-xs space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2DDD5] pb-3.5 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-[#C04A26]/10 text-[#C04A26]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-serif font-bold text-[#1F2421] uppercase tracking-wider">
                Role-Based Access Control (RBAC)
              </h2>
              <span className="text-[11px] text-[#5E6460]">Select active persona to switch platform permissions</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#5E6460]">Active Persona:</span>
            <span className="text-xs font-bold text-[#C04A26] bg-[#C04A26]/10 px-2.5 py-0.5 rounded-full border border-[#C04A26]/25">
              {currentRole}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          {[
            {
              role: 'Policymaker',
              badge: 'Policy & Scenarios',
              color: '#C04A26',
              desc: 'Can compare scenarios, adjust policy sensitivity weights, and generate executive evidence briefs.'
            },
            {
              role: 'Researcher',
              badge: 'Grounded RAG',
              color: '#1E6B48',
              desc: 'Can query grounded RAG copilot, inspect statutory and peer-reviewed documents, and analyze transition matrices.'
            },
            {
              role: 'Government Analyst',
              badge: 'ML & GIS Audit',
              color: '#254E7A',
              desc: 'Can review ML calibration curves, spatial validation metrics, and audit feature provenance chains.'
            },
            {
              role: 'Public User',
              badge: 'Transparency Mode',
              color: '#D49B28',
              desc: 'Read-only access to approved non-sensitive maps and aggregate district statistics.'
            }
          ].map((item) => {
            const isSelected = currentRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => onRoleChange(item.role as UserRole)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FAF5EC] border-[#C04A26] ring-2 ring-[#C04A26]/30 shadow-xs'
                    : 'bg-[#FAF9F5] hover:bg-[#F5F2EA] border-[#E2DDD5]'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold font-serif text-sm ${isSelected ? 'text-[#C04A26]' : 'text-[#1F2421]'}`}>
                      {item.role}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                        borderColor: `${item.color}30`,
                        borderWidth: 1
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-[#C04A26] shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#D4C8BA]" />
                  )}
                </div>
                <p className="text-[11px] text-[#5E6460] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live System Diagnostics & Telemetry */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2DDD5] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3">
          <h2 className="text-xs font-serif font-bold text-[#1F2421] uppercase tracking-wider flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#1E6B48]" />
            <span>Platform Telemetry &amp; Diagnostics</span>
          </h2>
          <span className="text-[11px] font-mono text-[#1E6B48] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#1E6B48] animate-pulse"></span>
            <span>All Systems Nominal</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2DDD5] flex items-center space-x-4">
            <RadialProgressRing
              value={99.8}
              size={52}
              strokeWidth={5}
              color="#1E6B48"
              trackColor="#E2DDD5"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#5E6460] block">API Health &amp; Uptime</span>
              <span className="text-sm font-bold text-[#1F2421] font-mono">99.8% Uptime</span>
              <span className="text-[10px] text-[#1E6B48] block font-semibold">Latency: ~18ms</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2DDD5] flex items-center space-x-4">
            <RadialProgressRing
              value={94.2}
              size={52}
              strokeWidth={5}
              color="#254E7A"
              trackColor="#E2DDD5"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#5E6460] block">Spatial Grid Cache</span>
              <span className="text-sm font-bold text-[#1F2421] font-mono">94.2% Hit Rate</span>
              <span className="text-[10px] text-[#254E7A] block font-semibold">320 Grids In-Memory</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2DDD5] flex items-center space-x-4">
            <RadialProgressRing
              value={100}
              size={52}
              strokeWidth={5}
              color="#D49B28"
              trackColor="#E2DDD5"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#5E6460] block">CRS Projection Integrity</span>
              <span className="text-sm font-bold text-[#1F2421] font-mono">100.0% Validated</span>
              <span className="text-[10px] text-[#D49B28] block font-semibold">EPSG:4326 Exact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spatial & Jurisdiction Settings */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2DDD5] shadow-xs space-y-4 text-xs">
        <h2 className="text-xs font-serif font-bold text-[#1F2421] uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-[#E2DDD5]">
          <Globe className="w-4 h-4 text-[#1E6B48]" />
          <span>Spatial &amp; Jurisdiction Configuration</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E2DDD5] space-y-1">
            <span className="text-[#5E6460] block text-[11px] font-medium uppercase tracking-wider">Jurisdiction:</span>
            <span className="font-bold text-[#1F2421] flex items-center gap-1.5 text-xs">
              <MapPin className="w-4 h-4 text-[#C04A26] shrink-0" />
              <span>State of Tamil Nadu, India</span>
            </span>
          </div>
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E2DDD5] space-y-1">
            <span className="text-[#5E6460] block text-[11px] font-medium uppercase tracking-wider">Spatial Coverage:</span>
            <span className="font-bold text-[#1F2421] flex items-center gap-1.5 text-xs">
              <Compass className="w-4 h-4 text-[#D49B28] shrink-0" />
              <span>Statewide (38 Districts &amp; Taluk Spatial Grids)</span>
            </span>
          </div>
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E2DDD5] space-y-1">
            <span className="text-[#5E6460] block text-[11px] font-medium uppercase tracking-wider">Coordinate Reference System:</span>
            <span className="font-mono font-bold text-[#1F2421] text-xs">EPSG:4326 (WGS 84 Ellipsoid)</span>
          </div>
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E2DDD5] space-y-1">
            <span className="text-[#5E6460] block text-[11px] font-medium uppercase tracking-wider">Backend REST API Endpoint:</span>
            <span className="font-mono font-bold text-[#1F2421] flex items-center gap-1.5 text-xs">
              <Server className="w-4 h-4 text-[#1E6B48] shrink-0" />
              <span>http://127.0.0.1:8000/api/v1</span>
            </span>
          </div>
        </div>
      </div>

      {/* Privacy & Statutory Guardrails */}
      <div className="p-5 bg-gradient-to-br from-[#FAF5EC] to-[#FDFBF7] rounded-2xl border border-[#D49B28]/40 text-xs space-y-2.5 text-[#1F2421]">
        <div className="flex items-center space-x-2 font-serif font-bold text-[#1F2421]">
          <Lock className="w-4 h-4 text-[#D49B28]" />
          <span className="uppercase tracking-wider text-xs">Statutory Compliance &amp; Privacy Guardrails</span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#5E6460]">
          In strict compliance with Government of India and Government of Tamil Nadu data directives:
          This platform consumes only non-sensitive public remote sensing telemetry, open government statistics, and aggregated planning grids.
          <strong className="text-[#1F2421] block mt-1 font-semibold">
            No private citizen land ownership records, patta/chitta identification, or individual encumbrance certificates are collected, processed, or exposed.
          </strong>
        </p>
      </div>
    </div>
  );
};
