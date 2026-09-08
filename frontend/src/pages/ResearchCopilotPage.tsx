import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RAGResponse } from '../types';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  FileText,
  Scale,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  Database,
  Award
} from 'lucide-react';
import {
  KolamCorner,
  TamilGeometricDivider,
  PalmLeafCartographyScene,
  RadialProgressRing,
  PalmLeafDetail
} from '../components/common/TraditionalMotifs';

interface ResearchCopilotPageProps {
  onNavigateTab: (tab: any) => void;
}

const SAMPLE_QUERIES = [
  "Where is agricultural land most likely to experience built-up expansion in Tiruppur?",
  "What are the statutory rules under TNCDBR 2019 for converting agricultural land to non-agricultural use?",
  "What is the groundwater extraction status in Tiruppur North and Noyyal basin?",
  "How does NH-544 highway proximity impact smallholder agrarian fragmentation?"
];

export const ResearchCopilotPage: React.FC<ResearchCopilotPageProps> = ({ onNavigateTab }) => {
  const [question, setQuestion] = useState(SAMPLE_QUERIES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RAGResponse | null>(null);
  const [documents, setDocuments] = useState<{ policies: any[]; research: any[] }>({ policies: [], research: [] });

  useEffect(() => {
    // Initial grounded query
    handleQuery(SAMPLE_QUERIES[0]);
    api.getDocuments().then((docRes) => setDocuments(docRes)).catch(console.error);
  }, []);

  const handleQuery = async (queryText: string) => {
    setLoading(true);
    setQuestion(queryText);
    try {
      const res = await api.queryResearch(queryText);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      handleQuery(question.trim());
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Workspace Header with Heritage Banner */}
      <div className="relative bg-gradient-to-r from-[#FBF8F3] via-[#FAF5EC] to-[#F5EFE6] rounded-2xl p-6 border border-[#E2DDD5] shadow-xs overflow-hidden">
        <KolamCorner position="top-right" size={48} color="#C04A26" opacity={0.3} />
        <PalmLeafCartographyScene className="absolute -right-6 -bottom-10 w-96 h-40 opacity-15 pointer-events-none text-[#C04A26]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1F2421] tracking-wide">
                Research &amp; Policy Copilot
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C04A26]/10 text-[#C04A26] border border-[#C04A26]/30">
                Grounded RAG Pipeline
              </span>
            </div>
            <p className="text-xs text-[#5E6460] mt-1.5 max-w-3xl leading-relaxed">
              Grounded evidence synthesis across Tamil Nadu Town Planning Statutes (TNCDBR 2019, Section 47A) and peer-reviewed land transition studies across the Noyyal river basin.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs shrink-0">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-[#1E6B48]/30 text-[#1E6B48] font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Zero-Hallucination Attribution</span>
            </div>
          </div>
        </div>

        {/* Corpus KPI Summary Strip */}
        <div className="mt-4 pt-3 border-t border-[#E2DDD5]/70 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 text-xs">
          <div className="flex items-center space-x-2.5">
            <Scale className="w-4 h-4 text-[#C04A26]" />
            <div>
              <span className="text-[10px] text-[#5E6460] block uppercase font-bold">Statutory Acts</span>
              <span className="font-bold text-[#1F2421]">TNCDBR &amp; Sec 47A</span>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-4 h-4 text-[#1E6B48]" />
            <div>
              <span className="text-[10px] text-[#5E6460] block uppercase font-bold">Scientific Corpus</span>
              <span className="font-bold text-[#1F2421]">Peer-Reviewed GIS</span>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <Layers className="w-4 h-4 text-[#254E7A]" />
            <div>
              <span className="text-[10px] text-[#5E6460] block uppercase font-bold">Spatial Evidence</span>
              <span className="font-bold text-[#1F2421]">320 Grids Linked</span>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <Award className="w-4 h-4 text-[#D49B28]" />
            <div>
              <span className="text-[10px] text-[#5E6460] block uppercase font-bold">Attribution Protocol</span>
              <span className="font-bold text-[#1F2421]">100% Primary Proof</span>
            </div>
          </div>
        </div>
      </div>

      {/* Query Bar & Presets */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2DDD5] shadow-xs space-y-3.5 relative overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#858B87] absolute left-3.5 top-3" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a policy or research question grounded in Tamil Nadu land governance..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF9F5] border border-[#E2DDD5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C04A26]/20 focus:border-[#C04A26] text-[#1F2421] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#C04A26] hover:bg-[#A33B1C] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-70"
          >
            <Sparkles className="w-4 h-4 text-[#F3C258]" />
            <span>{loading ? 'Synthesizing Evidence...' : 'Retrieve Evidence'}</span>
          </button>
        </form>

        {/* Query Presets */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[10px] text-[#858B87] font-bold uppercase tracking-wider shrink-0">
            Curated Questions:
          </span>
          {SAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuery(q)}
              className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all shrink-0 text-left cursor-pointer ${
                question === q
                  ? 'bg-[#C04A26]/10 border-[#C04A26]/40 text-[#C04A26] font-bold shadow-2xs'
                  : 'bg-[#FAF9F5] hover:bg-[#F5F2EA] border-[#E2DDD5] text-[#1F2421]'
              }`}
            >
              {q.length > 52 ? q.substring(0, 52) + '...' : q}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Synthesized Grounded Answer Card with Progress Ring and Visual Meters */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2DDD5] shadow-xs space-y-5 relative overflow-hidden">
            <PalmLeafDetail size={40} opacity={0.25} color="#1E6B48" className="absolute top-3 right-3 pointer-events-none" />

            {/* Answer Header with Radial Verification Score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2DDD5] pb-4 gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#C04A26]/10 text-[#C04A26]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-serif font-bold text-[#1F2421] uppercase tracking-wider block">
                    Synthesized Evidence Answer
                  </span>
                  <span className="text-[11px] text-[#5E6460]">
                    Multi-document retrieval with verifiable statutory cross-references
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-[#FDFBF7] p-2 rounded-xl border border-[#E2DDD5]">
                <RadialProgressRing
                  value={Math.round(result.confidence_score * 100)}
                  size={46}
                  strokeWidth={4.5}
                  color="#1E6B48"
                  trackColor="#E8E3D9"
                />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-[#5E6460] block leading-none">Confidence Score</span>
                  <span className="text-xs font-bold text-[#1E6B48] font-mono">
                    {Math.round(result.confidence_score * 100)}% Verified Grounded
                  </span>
                </div>
              </div>
            </div>

            {/* Main Grounded Text */}
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2DDD5]/80">
              <p className="text-sm text-[#1F2421] leading-relaxed font-normal">
                {result.answer}
              </p>
            </div>

            {/* Key Evidence Bullet Points */}
            {result.key_evidence.length > 0 && (
              <div className="p-4 bg-[#F5F9F6] rounded-xl border border-[#1E6B48]/25 space-y-2.5">
                <h4 className="text-xs font-serif font-bold text-[#1E6B48] uppercase tracking-wider flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B48]" />
                  <span>Key Grounded Evidence Points ({result.key_evidence.length})</span>
                </h4>
                <ul className="space-y-2 text-xs text-[#383C39]">
                  {result.key_evidence.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C04A26] mt-1.5 shrink-0"></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Linked Locations & GIS Connection */}
            <div className="flex flex-wrap items-center justify-between pt-3 text-xs text-[#5E6460] border-t border-[#E2DDD5] gap-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#C04A26]" />
                <span className="font-bold text-[#1F2421]">Relevant Locations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.relevant_locations.map((loc, i) => (
                    <span key={i} className="bg-[#FAF5EC] px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-[#1F2421] border border-[#D49B28]/30">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('gis')}
                className="px-3.5 py-1.5 rounded-lg bg-[#C04A26]/10 text-[#C04A26] hover:bg-[#C04A26]/20 font-bold flex items-center space-x-1.5 transition-all cursor-pointer border border-[#C04A26]/25"
              >
                <span>Inspect in GIS Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sources & Citations Grid with Heritage Seals */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-serif font-bold text-[#1F2421] uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#C04A26]" />
                <span>Direct Primary Sources &amp; Statutory Citations ({result.sources.length})</span>
              </h3>
              <span className="text-[11px] text-[#5E6460]">Fully auditable citations</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.sources.map((src, idx) => (
                <div key={idx} className="bg-white p-4.5 rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col justify-between space-y-3.5 hover:border-[#C04A26]/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        src.type.includes('Policy') || src.type.includes('Statutory')
                          ? 'bg-[#C04A26]/10 text-[#C04A26] border border-[#C04A26]/25'
                          : 'bg-[#1E6B48]/10 text-[#1E6B48] border border-[#1E6B48]/25'
                      }`}>
                        {src.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#5E6460] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E2DDD5]">{src.year}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1F2421] leading-snug">{src.title}</h4>
                  </div>
                  <div className="pt-2.5 border-t border-[#E2DDD5] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#858B87] flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-[#1E6B48]" />
                      <span>Validated Source</span>
                    </span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C04A26] hover:text-[#A33B1C] font-bold flex items-center space-x-1 text-[11px] group"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Assumptions & Limitations */}
          <div className="p-4.5 bg-[#FAF5EC] border border-[#D49B28]/40 rounded-2xl text-xs space-y-2 text-[#1F2421]">
            <div className="flex items-center space-x-2 text-[#B5801E] font-bold">
              <AlertCircle className="w-4 h-4 text-[#B5801E]" />
              <span className="uppercase tracking-wider text-[11px] font-serif">Assumptions &amp; Methodological Limitations</span>
            </div>
            <p className="text-[#5E6460] text-xs leading-relaxed">
              <strong className="text-[#1F2421]">Assumptions:</strong> {result.assumptions}
            </p>
            <p className="text-[#5E6460] text-xs leading-relaxed">
              <strong className="text-[#1F2421]">Limitations:</strong> {result.limitations}
            </p>
          </div>
        </div>
      )}

      {/* Grounded Knowledge Base Corpus Overview */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2DDD5] shadow-xs space-y-5 relative overflow-hidden">
        <KolamCorner position="bottom-right" size={40} opacity={0.2} color="#1E6B48" />

        <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3">
          <h3 className="text-xs font-serif font-bold text-[#1F2421] uppercase tracking-wider flex items-center space-x-2">
            <Database className="w-4 h-4 text-[#C04A26]" />
            <span>Complete Tamil Nadu Knowledge Corpus Available to RAG</span>
          </h3>
          <span className="text-[11px] text-[#5E6460] font-mono">Index: Indexed &amp; Vectorized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Statutory Policies */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#C04A26] flex items-center space-x-1.5 text-xs font-serif">
              <Scale className="w-4 h-4 text-[#C04A26]" />
              <span>Government Acts &amp; Statutory Planning Regulations</span>
            </h4>
            <div className="space-y-2">
              {documents.policies.map((p: any) => (
                <div key={p.doc_id} className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DDD5] hover:border-[#C04A26]/30 transition-all">
                  <div className="font-bold text-[#1F2421]">{p.title}</div>
                  <div className="text-[11px] text-[#5E6460] mt-0.5">{p.jurisdiction} • <span className="text-[#C04A26] font-semibold">{p.sector}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Papers */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1E6B48] flex items-center space-x-1.5 text-xs font-serif">
              <BookOpen className="w-4 h-4 text-[#1E6B48]" />
              <span>Peer-Reviewed Scientific Studies (Noyyal / Western TN)</span>
            </h4>
            <div className="space-y-2">
              {documents.research.map((r: any) => (
                <div key={r.doc_id} className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DDD5] hover:border-[#1E6B48]/30 transition-all">
                  <div className="font-bold text-[#1F2421]">{r.title}</div>
                  <div className="text-[11px] text-[#5E6460] mt-0.5">{r.journal} (<span className="font-mono">{r.year}</span>)</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
