import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ExecutiveReport } from '../types';
import { Printer, X, Download, ShieldCheck, FileCheck, Layers, BookOpen, Cpu, Scale, AlertCircle } from 'lucide-react';
import {
  TamilEmblemBadge,
  TamilGeometricDivider,
  KolamCorner,
  TempleSkylineIllustration
} from './common/TraditionalMotifs';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, userRole }) => {
  const [report, setReport] = useState<ExecutiveReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState('scenario_sustainable');
  const [selectedTaluk, setSelectedTaluk] = useState('Avinashi');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.generateReport(selectedScenario, selectedTaluk, userRole)
        .then((res) => {
          setReport(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, selectedScenario, selectedTaluk, userRole]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1F2421]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#FAF9F5] rounded-2xl shadow-2xl border border-[#E2DDD5] max-w-4xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls Header */}
        <div className="px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E2DDD5] flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <TamilEmblemBadge size={32} />
            <div>
              <span className="text-xs font-serif font-bold text-[#1F2421]">Executive Evidence Brief Generator</span>
              <p className="text-[10px] text-[#5E6460]">State Land Governance &amp; Geospatial Intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="text-xs bg-white text-[#1F2421] border border-[#E2DDD5] rounded-xl px-3 py-1.5 focus:outline-hidden font-semibold cursor-pointer"
            >
              <option value="scenario_sustainable">Sustainable Development (Scenario 3)</option>
              <option value="scenario_industrial">Industrial Expansion (Scenario 2)</option>
              <option value="scenario_baseline">Baseline BAU (Scenario 1)</option>
            </select>
            <select
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
              className="text-xs bg-white text-[#1F2421] border border-[#E2DDD5] rounded-xl px-3 py-1.5 focus:outline-hidden font-semibold cursor-pointer"
            >
              <option value="Avinashi">Avinashi Taluk</option>
              <option value="Tiruppur North">Tiruppur North</option>
              <option value="Palladam">Palladam</option>
              <option value="Dharapuram">Dharapuram</option>
            </select>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#C04A26] hover:bg-[#A33B1C] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#858B87] hover:text-[#1F2421] p-1.5 rounded-lg hover:bg-[#EAE4D9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-[#1F2421] bg-white relative font-sans">
          <KolamCorner position="top-right" size={48} opacity={0.2} color="#C04A26" className="absolute top-2 right-2 no-print" />
          
          {loading ? (
            <div className="py-24 text-center text-[#5E6460] text-sm">
              <div className="w-8 h-8 border-3 border-[#C04A26] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Compiling multi-source evidence brief...
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Document Header */}
              <div className="border-b-2 border-[#C04A26] pb-5 relative overflow-hidden">
                <TempleSkylineIllustration className="absolute -right-8 -bottom-4 w-72 h-20 opacity-12 pointer-events-none text-[#C04A26]" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-xs font-serif font-extrabold uppercase tracking-wider text-[#C04A26]">
                      {report.jurisdiction}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1F2421] mt-1">
                      {report.title}
                    </h1>
                    <p className="text-xs text-[#5E6460] mt-1 font-medium">
                      Focal District: {report.pilot_region?.district || 'Tiruppur'} • Sub-district: {report.pilot_region?.focal_taluk || selectedTaluk} • Evaluated Area: {(report.pilot_region?.total_evaluated_hectares || 518700).toLocaleString()} ha
                    </p>
                  </div>
                  <div className="text-right text-xs text-[#5E6460] shrink-0 bg-[#FAF9F5] p-3 rounded-xl border border-[#E2DDD5]">
                    <p className="font-bold text-[#1F2421]">Date: {report.date_generated}</p>
                    <p className="mt-0.5">Issuing: <span className="font-semibold text-[#1F2421]">{report.issuing_entity}</span></p>
                    <p className="mt-0.5">Role: <span className="font-semibold text-[#C04A26]">{report.generated_for_role}</span></p>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4.5 bg-[#FAF5EC] border-l-4 border-[#C04A26] rounded-r-xl text-xs leading-relaxed text-[#1F2421]">
                <h3 className="font-serif font-bold text-[#C04A26] mb-1.5 uppercase tracking-wider text-xs">
                  Executive Summary
                </h3>
                <p className="text-[#383C39] leading-relaxed text-xs">{report.executive_summary}</p>
              </div>

              {/* Evidence Taxonomy Breakdown */}
              {report.evidence_taxonomy && (
                <div className="space-y-4">
                  <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#C04A26] flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-[#1E6B48]" />
                    <span>Evidence Taxonomy &amp; Grounded Data Lineage</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    {/* Observed Satellite Telemetry */}
                    <div className="p-4 rounded-xl border border-[#E2DDD5] bg-[#FAF9F5] space-y-2">
                      <span className="text-[10px] font-bold text-[#1E6B48] uppercase font-mono flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Observed Satellite Telemetry</span>
                      </span>
                      <ul className="space-y-1.5 text-[#5E6460] text-[11px]">
                        {report.evidence_taxonomy.observed_data?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#C04A26] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Research & Hydrological Citations */}
                    <div className="p-4 rounded-xl border border-[#E2DDD5] bg-[#FAF9F5] space-y-2">
                      <span className="text-[10px] font-bold text-[#D49B28] uppercase font-mono flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>Empirical Research &amp; Field Studies</span>
                      </span>
                      <ul className="space-y-1.5 text-[#5E6460] text-[11px]">
                        {report.evidence_taxonomy.research_evidence?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#D49B28] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Machine Learning Forecasts */}
                    <div className="p-4 rounded-xl border border-[#E2DDD5] bg-[#FAF9F5] space-y-2">
                      <span className="text-[10px] font-bold text-[#C04A26] uppercase font-mono flex items-center gap-1.5">
                        <Cpu className="w-4 h-4" />
                        <span>Machine Learning Projections</span>
                      </span>
                      <ul className="space-y-1.5 text-[#5E6460] text-[11px]">
                        {report.evidence_taxonomy.model_predictions?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#C04A26] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Statutory Constraints */}
                    <div className="p-4 rounded-xl border border-[#E2DDD5] bg-[#FAF9F5] space-y-2">
                      <span className="text-[10px] font-bold text-[#254E7A] uppercase font-mono flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-[#254E7A]" />
                        <span>Statutory Framework Grounding</span>
                      </span>
                      <ul className="space-y-1.5 text-[#5E6460] text-[11px]">
                        {report.evidence_taxonomy.statutory_assumptions?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#254E7A] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <TamilGeometricDivider color="#C04A26" opacity={0.3} />

              {/* Actionable Policy Recommendations */}
              <div className="p-4.5 rounded-2xl border border-[#1E6B48]/30 bg-[#1E6B48]/8 space-y-2.5">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1E6B48]">
                  Actionable Policy Recommendations &amp; Institutional Protocol
                </h3>
                <ul className="space-y-2 text-xs text-[#1F2421] leading-relaxed">
                  {(report.actionable_policy_recommendations || []).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[#1E6B48] font-bold text-base leading-none">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              {report.disclaimer && (
                <div className="p-3.5 bg-[#FAF9F5] border border-[#E2DDD5] rounded-xl text-[11px] text-[#5E6460] flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#D49B28] shrink-0" />
                  <span>{report.disclaimer}</span>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
