import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ModelMetrics } from '../types';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Scale,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Sliders,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  RadialProgressRing,
  MiniSparklineArea,
  PalmLeafCartographyScene
} from '../components/common/TraditionalMotifs';

export const ModelsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<ModelMetrics[]>([]);
  const [comparisonSummary, setComparisonSummary] = useState<any>(null);
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const res = await api.getModelsEvaluation();
      setModels(res.models);
      setComparisonSummary(res.comparison_summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || models.length === 0) {
    return (
      <div className="p-16 text-center text-[#5E6460] font-sans text-sm flex flex-col items-center justify-center space-y-3">
        <Cpu className="w-10 h-10 text-[#C04A26] animate-pulse" />
        <p className="font-serif font-bold text-[#1A1F1C]">Loading Model Evaluation &amp; Monitoring Engine...</p>
      </div>
    );
  }

  const currentModel = models[selectedModelIdx];

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
                  Model Evaluation &amp; Monitoring Dashboard
                </h1>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#C04A26]/10 text-[#C04A26] border border-[#C04A26]/25">
                  Audit Standard
                </span>
              </div>
              <p className="text-xs text-[#5E6460] mt-1 max-w-3xl leading-relaxed">
                Cross-validation, calibration curves, confusion matrices, and feature attribution across dual tree ensembles.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setSelectedModelIdx(0)}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-xs ${
                selectedModelIdx === 0
                  ? 'bg-[#C04A26] text-white shadow-md'
                  : 'bg-white text-[#1A1F1C] hover:bg-[#F5EFE6] border border-[#E2DDD5]'
              }`}
            >
              Model A: Random Forest
            </button>
            <button
              onClick={() => setSelectedModelIdx(1)}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-xs ${
                selectedModelIdx === 1
                  ? 'bg-[#1E6B48] text-white shadow-md'
                  : 'bg-white text-[#1A1F1C] hover:bg-[#F5EFE6] border border-[#E2DDD5]'
              }`}
            >
              Model B: Gradient Boosting
            </button>
          </div>
        </div>

        <TamilGeometricDivider className="mt-5 text-[#D49B28]" />
      </div>

      {/* Model Performance Cards Strip with Radial Gauges (Replaces Plain Text Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Validation ROC-AUC */}
        <div className="p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col items-center justify-between space-y-2 group hover:border-[#1E6B48]/40 transition-all">
          <span className="text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-center">
            Validation ROC-AUC
          </span>
          <RadialProgressRing
            value={Math.round(currentModel.roc_auc * 100)}
            size={60}
            strokeWidth={5}
            color="#1E6B48"
            unit="%"
          />
          <span className="text-[10px] font-mono font-bold text-[#1E6B48]">
            {currentModel.roc_auc} (5-Fold)
          </span>
        </div>

        {/* Metric 2: Precision */}
        <div className="p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col items-center justify-between space-y-2 group hover:border-[#C04A26]/40 transition-all">
          <span className="text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-center">
            Precision
          </span>
          <RadialProgressRing
            value={Math.round(currentModel.precision * 100)}
            size={60}
            strokeWidth={5}
            color="#C04A26"
            unit="%"
          />
          <span className="text-[10px] font-mono font-bold text-[#C04A26]">
            {currentModel.precision} (Conversion)
          </span>
        </div>

        {/* Metric 3: Recall */}
        <div className="p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col items-center justify-between space-y-2 group hover:border-[#D49B28]/40 transition-all">
          <span className="text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-center">
            Recall
          </span>
          <RadialProgressRing
            value={Math.round(currentModel.recall * 100)}
            size={60}
            strokeWidth={5}
            color="#D49B28"
            unit="%"
          />
          <span className="text-[10px] font-mono font-bold text-[#996B1E]">
            {currentModel.recall} (Sensitivity)
          </span>
        </div>

        {/* Metric 4: F1-Score */}
        <div className="p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col items-center justify-between space-y-2 group hover:border-[#254E7A]/40 transition-all">
          <span className="text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-center">
            F1-Score
          </span>
          <RadialProgressRing
            value={Math.round(currentModel.f1_score * 100)}
            size={60}
            strokeWidth={5}
            color="#254E7A"
            unit="%"
          />
          <span className="text-[10px] font-mono font-bold text-[#254E7A]">
            {currentModel.f1_score} (Harmonic)
          </span>
        </div>

        {/* Metric 5: PR-AUC */}
        <div className="p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col items-center justify-between space-y-2 group hover:border-[#1E6B48]/40 transition-all">
          <span className="text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-center">
            PR-AUC
          </span>
          <RadialProgressRing
            value={Math.round(currentModel.pr_auc * 100)}
            size={60}
            strokeWidth={5}
            color="#1E6B48"
            unit="%"
          />
          <span className="text-[10px] font-mono font-bold text-[#1E6B48]">
            {currentModel.pr_auc} (PR Curve)
          </span>
        </div>

        {/* Metric 6: Sample Size */}
        <div className="p-4 bg-white rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col items-center justify-between space-y-2">
          <span className="text-[10px] font-bold text-[#5E6460] uppercase tracking-wider text-center">
            Sample Size
          </span>
          <div className="text-xl font-mono font-extrabold text-[#1A1F1C] my-auto">
            {currentModel.sample_size}
          </div>
          <span className="text-[10px] text-[#5E6460] text-center">
            Agricultural parcels
          </span>
        </div>
      </div>

      {/* Middle Grid: Feature Importance (7 cols) & Confusion Matrix + Calibration (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Feature Importance */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
            <div>
              <h2 className="text-sm font-serif font-bold text-[#1A1F1C]">
                Feature Importance Ranking ({currentModel.model_name})
              </h2>
              <p className="text-[11px] text-[#5E6460]">
                Gini impurity decrease / gradient contribution per geospatial variable
              </p>
            </div>
            <span className="text-xs font-mono text-[#5E6460]">Unit: %</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={currentModel.feature_importance}
                margin={{ top: 5, right: 20, left: 140, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2DDD5" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#1A1F1C' }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#1A1F1C' }}
                  width={135}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF9F5',
                    borderColor: '#E2DDD5',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#1A1F1C',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                />
                <Bar
                  dataKey="importance_pct"
                  fill={selectedModelIdx === 0 ? '#C04A26' : '#1E6B48'}
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 cols: Confusion Matrix & Calibration Diagram */}
        <div className="lg:col-span-5 space-y-4">
          {/* Confusion Matrix Box */}
          <div className="bg-white p-5 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-3">
            <h3 className="text-xs font-serif font-bold text-[#1A1F1C] uppercase tracking-wider">
              Cross-Validated Confusion Matrix
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-3.5 bg-[#1E6B48]/10 rounded-2xl border border-[#1E6B48]/30">
                <div className="text-[10px] text-[#1E6B48] font-bold font-sans">True Negative (Retained)</div>
                <div className="text-xl font-bold text-[#1E6B48] mt-0.5">
                  {currentModel.confusion_matrix.true_negative}
                </div>
              </div>
              <div className="p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5]">
                <div className="text-[10px] text-[#5E6460] font-sans">False Positive</div>
                <div className="text-xl font-bold text-[#1A1F1C] mt-0.5">
                  {currentModel.confusion_matrix.false_positive}
                </div>
              </div>
              <div className="p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5]">
                <div className="text-[10px] text-[#5E6460] font-sans">False Negative</div>
                <div className="text-xl font-bold text-[#1A1F1C] mt-0.5">
                  {currentModel.confusion_matrix.false_negative}
                </div>
              </div>
              <div className="p-3.5 bg-[#C04A26]/10 rounded-2xl border border-[#C04A26]/30">
                <div className="text-[10px] text-[#C04A26] font-bold font-sans">True Positive (Converted)</div>
                <div className="text-xl font-bold text-[#C04A26] mt-0.5">
                  {currentModel.confusion_matrix.true_positive}
                </div>
              </div>
            </div>
          </div>

          {/* Reliability / Calibration Curve */}
          <div className="bg-white p-5 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2DDD5]">
              <h3 className="text-xs font-serif font-bold text-[#1A1F1C] uppercase tracking-wider">
                Reliability &amp; Calibration
              </h3>
              <span className="text-[10px] font-bold text-[#1E6B48] bg-[#1E6B48]/10 px-2 py-0.5 rounded">Well-Calibrated</span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentModel.calibration_curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD5" />
                  <XAxis dataKey="predicted_bin" tick={{ fontSize: 10, fill: '#1A1F1C' }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: '#1A1F1C' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF9F5',
                      borderColor: '#E2DDD5',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#1A1F1C'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="observed_fraction"
                    stroke="#1E6B48"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#1E6B48' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Model Governance Metadata & Limitations with Palm Leaf Watermark */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-3 relative overflow-hidden">
        <div className="absolute right-4 bottom-1 w-1/4 opacity-15 pointer-events-none hidden md:block">
          <PalmLeafCartographyScene />
        </div>

        <h3 className="text-xs font-serif font-bold text-[#1A1F1C] uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1E6B48]" />
          <span>Model Governance Card &amp; Technical Limitations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] space-y-1">
            <span className="font-serif font-bold text-[#1A1F1C] block mb-1">Spatial Validation Method</span>
            <p className="text-[#5E6460] text-[11px] leading-relaxed">
              Stratified 5-Fold Cross-Validation with spatial grouping to prevent spatial autocorrelation leakage between adjacent parcels.
            </p>
          </div>
          <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] space-y-1">
            <span className="font-serif font-bold text-[#1A1F1C] block mb-1">Training Inputs</span>
            <p className="text-[#5E6460] text-[11px] leading-relaxed">
              Sentinel-2 Multi-Spectral Indices (B4, B8, B11, B3), NRSC Bhuvan LULC, OGD Demographics, and OSM Vector Highways.
            </p>
          </div>
          <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#D49B28]/30 space-y-1">
            <span className="font-serif font-bold text-[#996B1E] block mb-1">Mandatory Governance Limitation</span>
            <p className="text-[#5E6460] text-[11px] leading-relaxed">
              {currentModel.limitations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
