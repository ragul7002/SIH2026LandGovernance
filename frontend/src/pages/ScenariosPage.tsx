import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ScenarioItem } from '../types';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Scale,
  ShieldAlert,
  Calculator,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  KolamCorner,
  TamilGeometricDivider,
  TamilEmblemBadge,
  TextileWeavingScene,
  AgriculturalEriScene,
  MetricGaugeDial,
  DualSegmentBarMeter
} from '../components/common/TraditionalMotifs';

interface ScenariosPageProps {
  onNavigateTab: (tab: any) => void;
  onOpenReport: () => void;
}

export const ScenariosPage: React.FC<ScenariosPageProps> = ({ onNavigateTab, onOpenReport }) => {
  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
  const [weights, setWeights] = useState({
    development_suitability: 0.25,
    infrastructure_access: 0.25,
    agricultural_preservation: 0.20,
    water_flood_safety: 0.15,
    ecological_protection: 0.15
  });

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    setLoading(true);
    try {
      const res = await api.getScenarios();
      setScenarios(res.scenarios);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = async (key: string, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    try {
      const res = await api.simulateScenarios(updated);
      setScenarios(res.scenarios);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetWeights = async () => {
    const defaultW = {
      development_suitability: 0.25,
      infrastructure_access: 0.25,
      agricultural_preservation: 0.20,
      water_flood_safety: 0.15,
      ecological_protection: 0.15
    };
    setWeights(defaultW);
    try {
      const res = await api.simulateScenarios(defaultW);
      setScenarios(res.scenarios);
    } catch (err) {
      console.error(err);
    }
  };

  // Prepare chart data for comparative visualization
  const comparisonData = scenarios.map((s) => ({
    name: s.name.split(':')[0],
    overall_score: s.scoring.overall_score,
    agri_preservation: s.indicators.agricultural_preservation,
    infra_access: s.indicators.infrastructure_access,
    water_safety: s.indicators.water_flood_safety
  }));

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
                  Policy Scenario Simulator &amp; Sensitivity Engine
                </h1>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#C04A26]/10 text-[#C04A26] border border-[#C04A26]/25">
                  Multi-Objective Policy Trade-off
                </span>
              </div>
              <p className="text-xs text-[#5E6460] mt-1 max-w-3xl leading-relaxed">
                Transparent policy experimentation. Compare trade-offs between industrial growth corridors, agricultural preservation, and water security.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenReport}
            className="px-4 py-2.5 bg-[#C04A26] hover:bg-[#9E3A26] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-2 self-start md:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Evidence Brief</span>
          </button>
        </div>

        <TamilGeometricDivider className="mt-5 text-[#D49B28]" />
      </div>

      {/* Transparent Formula Banner with Kolam Motif */}
      <div className="p-5 bg-[#FAF9F5] rounded-3xl border border-[#E2DDD5] shadow-xs space-y-2.5 relative overflow-hidden">
        <KolamCorner position="top-right" size={36} opacity={0.15} color="#C04A26" className="absolute top-1 right-1 pointer-events-none" />

        <div className="flex items-center space-x-2 text-[#C04A26] font-serif font-bold text-xs uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>Transparent Land Development Impact Score Formula (0–100)</span>
        </div>
        <div className="p-3 bg-white rounded-2xl border border-[#E2DDD5] font-mono text-xs text-[#1A1F1C] overflow-x-auto shadow-2xs">
          Score = ({weights.development_suitability.toFixed(2)} × DevSuitability) + ({weights.infrastructure_access.toFixed(2)} × InfraAccess) + ({weights.agricultural_preservation.toFixed(2)} × AgriPreservation) + ({weights.water_flood_safety.toFixed(2)} × WaterSafety) + ({weights.ecological_protection.toFixed(2)} × EcoProtection)
        </div>
        <p className="text-[11px] text-[#5E6460]">
          <strong>Mandatory Classification:</strong> Decision-support score — not a statutory policy decree or automatic rezoning permit.
        </p>
      </div>

      {/* 3 Scenarios Cards Grid with Live Metric Dials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((s) => {
          const isSustainable = s.id === 'scenario_sustainable';
          return (
            <div
              key={s.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                isSustainable ? 'border-[#1E6B48] ring-1 ring-[#1E6B48]/30' : 'border-[#E2DDD5]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-sm font-serif font-bold text-[#1A1F1C] block">{s.name}</span>
                    <p className="text-xs text-[#5E6460] mt-1 leading-snug">{s.tagline}</p>
                  </div>
                  <MetricGaugeDial
                    value={s.scoring.overall_score}
                    size={72}
                    color={isSustainable ? '#1E6B48' : '#C04A26'}
                    sublabel="/100"
                  />
                </div>

                {/* Quantitative Impacts */}
                <div className="mt-4 pt-4 border-t border-[#E2DDD5] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#5E6460]">Projected Agri Loss:</span>
                    <span className="font-mono font-bold text-[#C04A26]">
                      {s.indicators.projected_agri_loss_ha.toLocaleString()} ha
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5E6460]">Built-up Footprint Growth:</span>
                    <span className="font-mono font-semibold text-[#1A1F1C]">
                      +{s.indicators.projected_built_growth_pct}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5E6460]">Economic Output Growth:</span>
                    <span className="font-mono font-semibold text-[#1E6B48]">
                      ₹{s.indicators.economic_output_growth_cr.toLocaleString()} Cr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5E6460]">Groundwater Exposure:</span>
                    <span className="font-semibold text-[#996B1E] text-right text-[11px] max-w-[150px]">
                      {s.indicators.groundwater_stress_exposure}
                    </span>
                  </div>
                </div>

                {/* Score Component Breakdown */}
                <div className="mt-4 pt-3 border-t border-[#E2DDD5] space-y-1.5">
                  <span className="text-[11px] font-bold text-[#1A1F1C] block uppercase tracking-wider">
                    Score Components:
                  </span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#5E6460]">Agri Preservation:</span>
                      <span className="font-mono font-semibold text-[#1A1F1C]">
                        {s.scoring.component_contributions.agricultural_preservation} pts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5E6460]">Water / Flood Safety:</span>
                      <span className="font-mono font-semibold text-[#1A1F1C]">
                        {s.scoring.component_contributions.water_flood_safety} pts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5E6460]">Infrastructure Access:</span>
                      <span className="font-mono font-semibold text-[#1A1F1C]">
                        {s.scoring.component_contributions.infrastructure_access} pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2DDD5] text-[11px] text-[#5E6460]">
                {isSustainable
                  ? 'Recommended: Balances Noyyal basin protection with planned industrial cluster growth.'
                  : 'Trade-off: Heavy pressure on groundwater and agrarian livelihoods along NH-544.'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sensitivity Analysis Control Panel */}
      <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2DDD5] pb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#1A1F1C] flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#C04A26]" />
              <span>Sensitivity Analysis: "What changes the result?"</span>
            </h3>
            <p className="text-xs text-[#5E6460] mt-0.5">
              Adjust policy objective weights in real time to observe the sensitivity of scenario scores and trade-offs.
            </p>
          </div>
          <button
            onClick={handleResetWeights}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-[#F5EFE6] text-[#1A1F1C] text-xs font-bold rounded-xl border border-[#E2DDD5] transition-all shadow-2xs self-start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C04A26]" />
            <span>Reset Weights</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Slider 1: Agri Preservation */}
          <div className="space-y-2 p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1A1F1C]">Agricultural Preservation</span>
              <span className="font-mono font-bold text-[#1E6B48] bg-[#1E6B48]/10 px-2 py-0.5 rounded">
                {weights.agricultural_preservation.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={weights.agricultural_preservation}
              onChange={(e) => handleWeightChange('agricultural_preservation', parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E2DDD5] rounded-lg cursor-pointer accent-[#1E6B48]"
            />
            <p className="text-[10px] text-[#5E6460]">Penalizes farmland loss &amp; enforces Section 47A audits.</p>
          </div>

          {/* Slider 2: Infrastructure Priority */}
          <div className="space-y-2 p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1A1F1C]">Infrastructure Proximity</span>
              <span className="font-mono font-bold text-[#C04A26] bg-[#C04A26]/10 px-2 py-0.5 rounded">
                {weights.infrastructure_access.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={weights.infrastructure_access}
              onChange={(e) => handleWeightChange('infrastructure_access', parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E2DDD5] rounded-lg cursor-pointer accent-[#C04A26]"
            />
            <p className="text-[10px] text-[#5E6460]">Rewards development adjacent to NH-544 and rail links.</p>
          </div>

          {/* Slider 3: Water/Flood Safety */}
          <div className="space-y-2 p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1A1F1C]">Water / Flood Safety</span>
              <span className="font-mono font-bold text-[#254E7A] bg-[#254E7A]/10 px-2 py-0.5 rounded">
                {weights.water_flood_safety.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={weights.water_flood_safety}
              onChange={(e) => handleWeightChange('water_flood_safety', parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E2DDD5] rounded-lg cursor-pointer accent-[#254E7A]"
            />
            <p className="text-[10px] text-[#5E6460]">Protects Noyyal riparian buffers &amp; over-exploited blocks.</p>
          </div>

          {/* Slider 4: Development Suitability */}
          <div className="space-y-2 p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1A1F1C]">Economic Development</span>
              <span className="font-mono font-bold text-[#C04A26] bg-[#C04A26]/10 px-2 py-0.5 rounded">
                {weights.development_suitability.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={weights.development_suitability}
              onChange={(e) => handleWeightChange('development_suitability', parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E2DDD5] rounded-lg cursor-pointer accent-[#C04A26]"
            />
            <p className="text-[10px] text-[#5E6460]">Prioritizes industrial expansion &amp; manufacturing clusters.</p>
          </div>

          {/* Slider 5: Ecological Protection */}
          <div className="space-y-2 p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1A1F1C]">Ecological Protection</span>
              <span className="font-mono font-bold text-[#1E6B48] bg-[#1E6B48]/10 px-2 py-0.5 rounded">
                {weights.ecological_protection.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={weights.ecological_protection}
              onChange={(e) => handleWeightChange('ecological_protection', parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E2DDD5] rounded-lg cursor-pointer accent-[#1E6B48]"
            />
            <p className="text-[10px] text-[#5E6460]">Mandates green buffers and soil conservation.</p>
          </div>
        </div>

        {/* Live Comparison Bar Chart */}
        <div className="pt-4 border-t border-[#E2DDD5] bg-white p-5 rounded-2xl border shadow-xs">
          <h4 className="text-xs font-serif font-bold text-[#1A1F1C] uppercase tracking-wider mb-3">
            Simulated Scenario Impact Comparison
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDD5" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1A1F1C' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#1A1F1C' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF9F5', borderColor: '#E2DDD5', fontSize: '11px', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="overall_score" name="Overall Policy Score" fill="#C04A26" radius={[4, 4, 0, 0]} />
                <Bar dataKey="agri_preservation" name="Agri Preservation" fill="#1E6B48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="infra_access" name="Infra Access" fill="#D49B28" radius={[4, 4, 0, 0]} />
                <Bar dataKey="water_safety" name="Water Safety" fill="#254E7A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
