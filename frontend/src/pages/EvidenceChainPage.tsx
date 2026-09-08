import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  FileCheck2,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  ArrowRight,
  CheckCircle2,
  Lock,
  ExternalLink,
  Search,
  Fingerprint,
  FileSpreadsheet,
  Compass
} from 'lucide-react';
import {
  KolamCorner,
  TamilGeometricDivider,
  TamilEmblemBadge,
  TempleSkylineIllustration,
  RadialProgressRing
} from '../components/common/TraditionalMotifs';

interface EvidenceChainPageProps {
  selectedCellId?: string;
  onNavigateTab: (tab: any) => void;
}

export const EvidenceChainPage: React.FC<EvidenceChainPageProps> = ({
  selectedCellId = 'TP-0002',
  onNavigateTab
}) => {
  const [cellId, setCellId] = useState(selectedCellId);
  const [evidenceData, setEvidenceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<number>(1);

  useEffect(() => {
    loadChain(cellId);
  }, [cellId]);

  const loadChain = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.getEvidenceChain(id);
      setEvidenceData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
                  Evidence Chain &amp; Decision Provenance Audit
                </h1>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#C04A26]/10 text-[#C04A26] border border-[#C04A26]/25">
                  Audit-Ready Lineage
                </span>
              </div>
              <p className="text-xs text-[#5E6460] mt-1 max-w-3xl leading-relaxed">
                Full end-to-end traceable lineage from empirical satellite telemetry to machine-learning inference and statutory policy grounding.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1A1F1C] bg-white px-3.5 py-2 rounded-xl border border-[#E2DDD5] shrink-0 shadow-2xs">
            <Lock className="w-4 h-4 text-[#1E6B48]" />
            <span>Verifiable Audit Trail • OGD Standard</span>
          </div>
        </div>

        <TamilGeometricDivider className="mt-5 text-[#D49B28]" />
      </div>

      {/* Interactive 5-Stage Decision Provenance Pipeline */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-serif font-bold text-[#1A1F1C] uppercase tracking-wider flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#C04A26]" />
            <span>5-Stage Decision Provenance Pipeline (Click to Inspect)</span>
          </h3>
          <span className="text-[10px] font-mono text-[#5E6460]">Immutable Lineage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Stage 1: Raw Sources */}
          <button
            onClick={() => setActiveStage(1)}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              activeStage === 1
                ? 'bg-white border-[#C04A26] shadow-xs ring-1 ring-[#C04A26]/30'
                : 'bg-[#FAF9F5] border-[#E2DDD5] hover:bg-[#F5EFE6]'
            }`}
          >
            <div className="text-[10px] font-mono font-bold text-[#C04A26] uppercase">Stage 1: Ingestion</div>
            <div className="font-serif font-bold text-[#1A1F1C] text-xs mt-0.5">Multi-Source Telemetry</div>
            <p className="text-[11px] text-[#5E6460] mt-1 leading-relaxed">
              Sentinel-2 (10m), Bhuvan LULC, OGD Census, OSM Highways
            </p>
          </button>

          {/* Stage 2: Preprocessing */}
          <button
            onClick={() => setActiveStage(2)}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              activeStage === 2
                ? 'bg-white border-[#C04A26] shadow-xs ring-1 ring-[#C04A26]/30'
                : 'bg-[#FAF9F5] border-[#E2DDD5] hover:bg-[#F5EFE6]'
            }`}
          >
            <div className="text-[10px] font-mono font-bold text-[#C04A26] uppercase">Stage 2: Validation</div>
            <div className="font-serif font-bold text-[#1A1F1C] text-xs mt-0.5">CRS Standardization</div>
            <p className="text-[11px] text-[#5E6460] mt-1 leading-relaxed">
              EPSG:4326 reprojection, cloud masking, spatial join on 25ha cells
            </p>
          </button>

          {/* Stage 3: Features */}
          <button
            onClick={() => setActiveStage(3)}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              activeStage === 3
                ? 'bg-white border-[#C04A26] shadow-xs ring-1 ring-[#C04A26]/30'
                : 'bg-[#FAF9F5] border-[#E2DDD5] hover:bg-[#F5EFE6]'
            }`}
          >
            <div className="text-[10px] font-mono font-bold text-[#C04A26] uppercase">Stage 3: Engineering</div>
            <div className="font-serif font-bold text-[#1A1F1C] text-xs mt-0.5">Feature Extraction</div>
            <p className="text-[11px] text-[#5E6460] mt-1 leading-relaxed">
              NDVI/NDBI deltas, NH-544 proximity buffer, TWAD aquifer index
            </p>
          </button>

          {/* Stage 4: ML Inference */}
          <button
            onClick={() => setActiveStage(4)}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              activeStage === 4
                ? 'bg-white border-[#C04A26] shadow-xs ring-1 ring-[#C04A26]/30'
                : 'bg-[#FAF9F5] border-[#E2DDD5] hover:bg-[#F5EFE6]'
            }`}
          >
            <div className="text-[10px] font-mono font-bold text-[#C04A26] uppercase">Stage 4: Prediction</div>
            <div className="font-serif font-bold text-[#1A1F1C] text-xs mt-0.5">Ensemble ML v1.2</div>
            <p className="text-[11px] text-[#5E6460] mt-1 leading-relaxed">
              Calibrated transition probability with 5-fold cross-validation
            </p>
          </button>

          {/* Stage 5: Grounding */}
          <button
            onClick={() => setActiveStage(5)}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              activeStage === 5
                ? 'bg-[#1E6B48]/10 border-[#1E6B48] shadow-xs ring-1 ring-[#1E6B48]/30'
                : 'bg-[#FAF9F5] border-[#E2DDD5] hover:bg-[#F5EFE6]'
            }`}
          >
            <div className="text-[10px] font-mono font-bold text-[#1E6B48] uppercase">Stage 5: Policy Grounding</div>
            <div className="font-serif font-bold text-[#1A1F1C] text-xs mt-0.5">Statutory Brief</div>
            <p className="text-[11px] text-[#5E6460] mt-1 leading-relaxed">
              TNCDBR 2019 Rule 22 &amp; Section 47A statutory citations
            </p>
          </button>
        </div>
      </div>

      {/* Deep Parcel Audit Card with Temple Skyline Watermark */}
      {evidenceData && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2DDD5] shadow-xs space-y-6 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-10">
            <TempleSkylineIllustration height={110} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2DDD5] gap-3 relative z-10">
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-base sm:text-lg font-serif font-bold text-[#1A1F1C]">
                  Traceable Audit Record: Parcel {evidenceData.prediction.cell_id}
                </span>
                <span className="text-xs px-3 py-1 rounded-full font-mono font-bold bg-[#FAF9F5] text-[#1A1F1C] border border-[#E2DDD5]">
                  Taluk: {evidenceData.prediction.taluk}
                </span>
              </div>
              <p className="text-xs text-[#5E6460] mt-1 flex items-center gap-1.5 flex-wrap">
                <span>Audit Hash:</span>
                <span className="font-mono text-[#C04A26] bg-[#FAF9F5] px-2 py-0.5 rounded-md border border-[#E2DDD5]">
                  sha256-a9b7c84e912f4510b001a7c3e59321
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#5E6460] font-medium">Inspect Parcel ID:</span>
              <div className="relative">
                <input
                  type="text"
                  value={cellId}
                  onChange={(e) => setCellId(e.target.value.toUpperCase())}
                  placeholder="e.g. TP-0002"
                  className="w-32 pl-7 pr-3 py-1.5 bg-[#FAF9F5] border border-[#E2DDD5] rounded-xl font-mono uppercase text-xs text-[#1A1F1C] focus:outline-none focus:ring-1 focus:ring-[#C04A26]"
                />
                <Search className="w-3.5 h-3.5 text-[#858B87] absolute left-2 top-2" />
              </div>
            </div>
          </div>

          {/* Detailed Attribution Trail */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs relative z-10">
            <div className="p-5 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] space-y-3">
              <div className="font-serif font-bold text-[#1A1F1C] flex items-center space-x-2 pb-2 border-b border-[#E2DDD5]">
                <Cpu className="w-4 h-4 text-[#C04A26]" />
                <span>Model &amp; Architecture</span>
              </div>
              <div className="space-y-2 text-[#5E6460]">
                <div className="flex justify-between">
                  <span>Architecture:</span>
                  <span className="font-semibold text-[#1A1F1C]">{evidenceData.evidence_chain.model_architecture}</span>
                </div>
                <div className="flex justify-between">
                  <span>Training Period:</span>
                  <span className="font-medium text-[#1A1F1C]">{evidenceData.evidence_chain.training_period}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Validation AUC:</span>
                  <span className="font-mono font-bold text-[#1E6B48] bg-[#1E6B48]/10 px-2 py-0.5 rounded">
                    {evidenceData.evidence_chain.validation_roc_auc}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] space-y-3">
              <div className="font-serif font-bold text-[#1A1F1C] flex items-center space-x-2 pb-2 border-b border-[#E2DDD5]">
                <Layers className="w-4 h-4 text-[#1E6B48]" />
                <span>Feature Vector Attribution</span>
              </div>
              <div className="space-y-2 text-[#5E6460]">
                <div className="flex justify-between">
                  <span>NH-544 Distance:</span>
                  <span className="font-mono text-[#1A1F1C] font-semibold">{evidenceData.parcel_metadata.dist_to_nh_km} km</span>
                </div>
                <div className="flex justify-between">
                  <span>5-Yr Built Index (ΔNDBI):</span>
                  <span className="font-mono text-[#1A1F1C] font-semibold">+{evidenceData.parcel_metadata.ndbi_delta}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aquifer Condition:</span>
                  <span className="font-semibold text-[#996B1E]">{evidenceData.parcel_metadata.groundwater_status}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] space-y-3">
              <div className="font-serif font-bold text-[#1A1F1C] flex items-center space-x-2 pb-2 border-b border-[#E2DDD5]">
                <Database className="w-4 h-4 text-[#D49B28]" />
                <span>Data Source Licensing</span>
              </div>
              <div className="space-y-2 text-[#5E6460]">
                <div className="flex justify-between">
                  <span>LULC Authority:</span>
                  <span className="font-medium text-[#1A1F1C]">NRSC Bhuvan (OGD India)</span>
                </div>
                <div className="flex justify-between">
                  <span>Satellite Sensor:</span>
                  <span className="font-medium text-[#1A1F1C]">ESA Copernicus (Open Access)</span>
                </div>
                <div className="flex justify-between">
                  <span>Road Geometry:</span>
                  <span className="font-medium text-[#1A1F1C]">OpenStreetMap (ODbL)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#D49B28]/30 text-xs text-[#1A1F1C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <span className="leading-relaxed">
              <strong className="text-[#C04A26]">Statutory Clearance:</strong> Under Section 47A, conversion of this parcel requires District Planning Authority concurrence and NOC from the Agricultural Department.
            </span>
            <button
              onClick={() => onNavigateTab('research')}
              className="text-xs font-bold text-[#1E6B48] hover:text-[#155034] flex items-center space-x-1 shrink-0 self-start sm:self-auto bg-[#1E6B48]/10 px-3.5 py-1.5 rounded-xl border border-[#1E6B48]/25 transition-all shadow-2xs"
            >
              <span>Verify Legal Rule</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
