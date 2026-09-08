import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PredictionCell, CellExplanationResponse } from '../types';
import {
  TrendingUp,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Layers,
  Database,
  Compass,
  Cpu
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  KolamCorner,
  TamilGeometricDivider,
  TamilEmblemBadge,
  MetricGaugeDial,
  PalmLeafCartographyScene,
  RadialProgressRing
} from '../components/common/TraditionalMotifs';

interface PredictionsPageProps {
  selectedCellId?: string;
  onNavigateTab: (tab: any) => void;
  onSelectCell: (cellId: string) => void;
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({
  selectedCellId,
  onNavigateTab,
  onSelectCell
}) => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<PredictionCell[]>([]);
  const [riskCounts, setRiskCounts] = useState<Record<string, number>>({});
  const [selectedCell, setSelectedCell] = useState<PredictionCell | null>(null);
  const [explanation, setExplanation] = useState<CellExplanationResponse | null>(null);
  const [talukFilter, setTalukFilter] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');

  useEffect(() => {
    loadPredictions();
  }, [talukFilter, riskFilter]);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const res = await api.getPredictions(talukFilter || undefined, riskFilter || undefined);
      setPredictions(res.predictions);
      setRiskCounts(res.risk_breakdown);

      const initialCell = selectedCellId
        ? res.predictions.find((p) => p.cell_id === selectedCellId)
        : res.predictions.find((p) => p.risk_category === 'High' || p.risk_category === 'Very High') || res.predictions[0];

      if (initialCell) {
        handleSelectCell(initialCell);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCell = async (cell: PredictionCell) => {
    setSelectedCell(cell);
    onSelectCell(cell.cell_id);
    try {
      const expRes = await api.getCellExplanation(cell.cell_id);
      setExplanation(expRes);
    } catch (err) {
      console.error(err);
    }
  };

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
                  Machine Learning Transition Risk &amp; Explainability
                </h1>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#C04A26]/10 text-[#C04A26] border border-[#C04A26]/25">
                  Ensemble v1.2 (SHAP XAI)
                </span>
              </div>
              <p className="text-xs text-[#5E6460] mt-1 max-w-3xl leading-relaxed">
                Predicting probability of Agricultural → Built-up conversion based on Sentinel-2 spectral telemetry and road proximity.
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-[#5E6460] font-medium bg-white px-3.5 py-2 rounded-xl border border-[#E2DDD5] shrink-0 shadow-2xs">
            Language Standard: <span className="font-bold text-[#1A1F1C]">"Predicted transition probability"</span>
          </div>
        </div>

        <TamilGeometricDivider className="mt-5 text-[#D49B28]" />
      </div>

      {/* Risk Breakdown KPI Strip with Visual Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-[#C04A26]/30 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#C04A26] font-bold text-xs uppercase tracking-wider">Very High (&gt;80%)</span>
            <span className="w-2 h-2 rounded-full bg-[#C04A26] animate-ping" />
          </div>
          <div className="text-2xl font-mono font-black text-[#C04A26]">{riskCounts['Very High'] || 14} Cells</div>
          <span className="text-[10px] text-[#8C2D19] font-medium">Immediate conversion pressure</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#D49B28]/30 shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-[#996B1E] font-bold text-xs uppercase tracking-wider">High Risk (60–80%)</span>
          <div className="text-2xl font-mono font-black text-[#996B1E]">{riskCounts['High'] || 48} Cells</div>
          <span className="text-[10px] text-[#996B1E] font-medium">Within 3 km of NH-544</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-[#5E6460] font-bold text-xs uppercase tracking-wider">Moderate (40–60%)</span>
          <div className="text-2xl font-mono font-black text-[#1A1F1C]">{riskCounts['Moderate'] || 62} Cells</div>
          <span className="text-[10px] text-[#858B87] font-medium">Semi-critical groundwater</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#1E6B48]/30 shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-[#1E6B48] font-bold text-xs uppercase tracking-wider">Low Risk (20–40%)</span>
          <div className="text-2xl font-mono font-black text-[#1E6B48]">{riskCounts['Low'] || 86} Cells</div>
          <span className="text-[10px] text-[#1E6B48] font-medium">Agrarian stability</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#1E6B48]/40 shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-[#155034] font-bold text-xs uppercase tracking-wider">Very Low (&lt;20%)</span>
          <div className="text-2xl font-mono font-black text-[#155034]">{riskCounts['Very Low'] || 110} Cells</div>
          <span className="text-[10px] text-[#155034] font-medium">Canal command tracts</span>
        </div>
      </div>

      {/* Main Grid: Left List (4 cols) & Right "Why this result?" Explainability (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 cols: Parcel List & Filters */}
        <div className="lg:col-span-4 bg-[#FAF9F5] p-5 rounded-3xl border border-[#E2DDD5] shadow-xs flex flex-col space-y-3 h-[660px]">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-serif font-bold text-[#1A1F1C] uppercase tracking-wider">
              Evaluated Agricultural Parcels
            </h2>
            <span className="text-[11px] font-mono text-[#5E6460]">
              {predictions.length} Total
            </span>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <select
              value={talukFilter}
              onChange={(e) => setTalukFilter(e.target.value)}
              className="px-3 py-2 border border-[#E2DDD5] rounded-xl bg-white text-[#1A1F1C] focus:outline-hidden font-semibold cursor-pointer shadow-2xs"
            >
              <option value="">All Taluks</option>
              <option value="Tiruppur North">Tiruppur North</option>
              <option value="Avinashi">Avinashi</option>
              <option value="Palladam">Palladam</option>
              <option value="Kangeyam">Kangeyam</option>
              <option value="Dharapuram">Dharapuram</option>
              <option value="Udumalaipettai">Udumalaipettai</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-[#E2DDD5] rounded-xl bg-white text-[#1A1F1C] focus:outline-hidden font-semibold cursor-pointer shadow-2xs"
            >
              <option value="">All Risks</option>
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Scrollable Parcel List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {predictions.map((p) => {
              const isSelected = selectedCell?.cell_id === p.cell_id;
              const probPct = Math.round(p.transition_probability * 100);
              return (
                <button
                  key={p.cell_id}
                  onClick={() => handleSelectCell(p)}
                  className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-white border-[#C04A26] text-[#C04A26] font-bold shadow-xs ring-1 ring-[#C04A26]/30'
                      : 'bg-white hover:bg-[#F5EFE6] border-[#E2DDD5] text-[#1A1F1C]'
                  }`}
                >
                  <div>
                    <div className="font-mono font-bold text-[#1A1F1C]">{p.cell_id}</div>
                    <div className="text-[11px] text-[#5E6460]">{p.taluk}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] ${
                        probPct > 70
                          ? 'bg-[#C04A26]/12 text-[#C04A26]'
                          : probPct > 40
                          ? 'bg-[#D49B28]/15 text-[#996B1E]'
                          : 'bg-[#1E6B48]/12 text-[#1E6B48]'
                      }`}
                    >
                      {probPct}%
                    </span>
                    <div className="text-[10px] text-[#858B87] mt-0.5">{p.risk_category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 cols: Explainable AI "Why this result?" Panel with Metric Gauge Dial */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-6 relative overflow-hidden">
          <KolamCorner position="top-right" size={44} opacity={0.15} color="#C04A26" className="absolute top-2 right-2 pointer-events-none" />

          {selectedCell && explanation ? (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2DDD5] gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1F1C]">
                      Explainability Breakdown: Parcel {selectedCell.cell_id}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#C04A26]/10 text-[#C04A26]">
                      {selectedCell.taluk} Taluk
                    </span>
                  </div>
                  <p className="text-xs text-[#5E6460] mt-0.5">
                    Centroid: {selectedCell.lat.toFixed(4)}°N, {selectedCell.lon.toFixed(4)}°E • Ensemble Confidence: {Math.round(selectedCell.confidence * 100)}%
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('gis')}
                  className="px-3.5 py-2 bg-[#FAF9F5] hover:bg-[#F5EFE6] text-[#1A1F1C] font-bold rounded-xl text-xs border border-[#E2DDD5] flex items-center space-x-1.5 transition-all self-start shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C04A26]" />
                  <span>Highlight on GIS Map</span>
                </button>
              </div>

              {/* Main Risk Statement Card with Gauge Dial */}
              <div className="p-5 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#5E6460] font-medium block">
                    Predicted Agricultural → Built-up Transition Probability
                  </span>
                  <div className="text-3xl font-mono font-black text-[#C04A26] mt-0.5">
                    {Math.round(selectedCell.transition_probability * 100)}%
                  </div>
                  <span className="text-xs font-bold text-[#C04A26] bg-[#C04A26]/10 px-2.5 py-0.5 rounded-md mt-1 inline-block">
                    Category: {selectedCell.risk_category} Transition Risk
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <MetricGaugeDial
                    value={Math.round(selectedCell.transition_probability * 100)}
                    size={90}
                    color="#C04A26"
                  />
                  <div className="text-right text-xs text-[#5E6460] space-y-0.5 hidden sm:block">
                    <p className="font-semibold text-[#1A1F1C]">Model: {selectedCell.model_version}</p>
                    <p>ROC-AUC: <span className="font-mono font-bold text-[#1E6B48]">{explanation.evidence_chain.validation_roc_auc}</span></p>
                    <p>Target: {explanation.evidence_chain.target_horizon}</p>
                  </div>
                </div>
              </div>

              {/* "Why this result?" Horizontal Factor Contribution Chart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-serif font-bold text-[#1A1F1C] uppercase tracking-wider flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-[#C04A26]" />
                    <span>"Why this result?" — Contributing Factors</span>
                  </h4>
                  <span className="text-[11px] text-[#5E6460] font-mono">
                    Localized Feature Attribution (SHAP)
                  </span>
                </div>

                <div className="h-56 w-full bg-[#FAF9F5] p-4 rounded-2xl border border-[#E2DDD5]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={explanation.prediction.contributing_factors}
                      margin={{ top: 5, right: 30, left: 140, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2DDD5" />
                      <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#1A1F1C' }} />
                      <YAxis
                        type="category"
                        dataKey="factor"
                        tick={{ fontSize: 10, fill: '#1A1F1C' }}
                        width={135}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FAF9F5', borderColor: '#E2DDD5', fontSize: '11px', borderRadius: '12px' }}
                        formatter={(val: any) => [`${val}% contribution`, 'Weight']}
                      />
                      <Bar dataKey="contribution_pct" radius={[0, 6, 6, 0]}>
                        {explanation.prediction.contributing_factors.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.direction === 'increases_risk' ? '#C04A26' : '#1E6B48'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Factor Detail Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {explanation.prediction.contributing_factors.map((f, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] flex items-start justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#1A1F1C]">{f.factor}</div>
                        <div className="text-[11px] text-[#5E6460] mt-0.5">{f.detail}</div>
                      </div>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg ${
                          f.direction === 'increases_risk'
                            ? 'bg-[#C04A26]/12 text-[#C04A26]'
                            : 'bg-[#1E6B48]/12 text-[#1E6B48]'
                        }`}
                      >
                        {f.direction === 'increases_risk' ? '+' : '-'}{f.contribution_pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Provenance & Evidence Chain with Palm Leaf Art */}
              <div className="p-5 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] text-xs space-y-3 relative overflow-hidden">
                <div className="flex items-center space-x-2 font-serif font-bold text-[#1A1F1C]">
                  <Database className="w-4 h-4 text-[#D49B28]" />
                  <span>Input Datasets &amp; Provenance Trail</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  {explanation.evidence_chain.primary_datasets.map((d, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-[#E2DDD5] shadow-2xs">
                      <div className="font-semibold text-[#1A1F1C]">{d.dataset}</div>
                      <div className="text-[#5E6460]">{d.authority} • Res: {d.resolution}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[#858B87] pt-1">
                  <strong>Notice:</strong> {explanation.evidence_chain.decision_support_notice}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-[#858B87] text-sm flex flex-col items-center justify-center space-y-3">
              <Compass className="w-10 h-10 text-[#C04A26]/40" />
              <p className="font-serif font-bold text-[#1A1F1C]">Select an agricultural parcel to view Explainable AI breakdown.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
