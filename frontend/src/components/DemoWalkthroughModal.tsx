import React, { useState } from 'react';
import { NavTab } from './Sidebar';
import { CheckCircle2, ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';
import { TamilEmblemBadge, KolamCorner } from './common/TraditionalMotifs';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectCell?: (cellId: string) => void;
}

interface StepInfo {
  step: number;
  title: string;
  tab: NavTab;
  promptText: string;
  explanation: string;
  actionHint: string;
}

const DEMO_STEPS: StepInfo[] = [
  {
    step: 1,
    title: 'Open Overview Dashboard',
    tab: 'overview',
    promptText: 'Platform initialization & pilot district overview',
    explanation: 'Inspect high-level indicators for Tiruppur district, Tamil Nadu: 2.1% annual agricultural loss rate, 320 evaluated spatial grids, and multi-source satellite/census pipelines.',
    actionHint: 'View the pilot summary metrics and risk distribution cards.'
  },
  {
    step: 2,
    title: 'Ask Research Question',
    tab: 'research',
    promptText: 'Where is agricultural land most likely to experience built-up expansion in Tiruppur?',
    explanation: 'Submit the primary SIH problem statement query to the Research & Policy Copilot.',
    actionHint: 'Click "Ask Query" to trigger grounded RAG retrieval across Tamil Nadu planning corpus.'
  },
  {
    step: 3,
    title: 'Inspect Research & Policy Evidence',
    tab: 'research',
    promptText: 'View citations, statutes, and peer-reviewed studies',
    explanation: 'The grounded answer identifies Avinashi and Tiruppur North along NH-544 with strict citations to TNCDBR 2019, Section 47A, and Ramasamy et al. (2023). Zero hallucinations.',
    actionHint: 'Review key evidence points and clickable statutory source cards.'
  },
  {
    step: 4,
    title: 'Open GIS Explorer',
    tab: 'gis',
    promptText: 'Navigate to interactive spatial GIS interface',
    explanation: 'MapLibre/Leaflet vector engine loads 320 micro-spatial grids, administrative taluks, and highway corridors for Tiruppur district.',
    actionHint: 'Explore pan, zoom, and spatial layer controls.'
  },
  {
    step: 5,
    title: 'Examine Historical LULC (2018)',
    tab: 'gis',
    promptText: 'Toggle 2018 Baseline Land-Use Layer',
    explanation: 'Shows pre-expansion agrarian footprint where 72% of Tiruppur district was prime irrigated or dryland agriculture.',
    actionHint: 'Toggle the "LULC Baseline 2018" layer to view initial land classes.'
  },
  {
    step: 6,
    title: 'Examine Current LULC (2023)',
    tab: 'gis',
    promptText: 'Toggle 2023 Current Land-Use Layer',
    explanation: 'Highlights noticeable red built-up clusters spreading along the NH-544 Salem-Coimbatore axis and Avinashi bypass.',
    actionHint: 'Toggle to "LULC Current 2023" to observe 5-year conversion patterns.'
  },
  {
    step: 7,
    title: 'Activate ML Prediction Risk Heatmap',
    tab: 'gis',
    promptText: 'Overlay Predicted Conversion Probability',
    explanation: 'Spatial ML model shades cells from Very Low (green) to Very High (red) based on transition probability.',
    actionHint: 'Notice high-risk red polygons clustered around highways and peri-urban fringes.'
  },
  {
    step: 8,
    title: 'Select a High-Risk Parcel (e.g. TP-0002)',
    tab: 'predictions',
    promptText: 'Inspect cell-level micro-forecast',
    explanation: 'Select parcel TP-0002 in Tiruppur North/Avinashi to evaluate its 78% predicted conversion probability.',
    actionHint: 'View the prediction breakdown with confidence score.'
  },
  {
    step: 9,
    title: 'Explainable AI: "Why this result?"',
    tab: 'predictions',
    promptText: 'Inspect feature attribution & evidence chain',
    explanation: 'Transparent horizontal bar chart details factors: NH-544 proximity (+31%), peri-urban spillover (+24%), and ΔNDBI trend (+18%).',
    actionHint: 'Review the auditable data provenance and model limitations statement.'
  },
  {
    step: 10,
    title: 'Open Policy Scenario Simulator',
    tab: 'scenarios',
    promptText: 'Navigate to Multi-Objective Policy Engine',
    explanation: 'Evaluate 3 distinct policy pathways: Baseline (BAU), Industrial Expansion, and Sustainable Agro-Ecological Development.',
    actionHint: 'Observe side-by-side comparative cards with 0–100 Land Development Impact Scores.'
  },
  {
    step: 11,
    title: 'Compare 3 Scenarios Side-by-Side',
    tab: 'scenarios',
    promptText: 'Analyze trade-offs between economy and conservation',
    explanation: 'Industrial Expansion yields ₹7,800 Cr growth but sacrifices 6,900 ha of farmland and worsens water stress. Sustainable Development scores 79.9/100.',
    actionHint: 'Compare agricultural loss vs. infrastructure accessibility across scenarios.'
  },
  {
    step: 12,
    title: 'Sensitivity Analysis: Adjust Sliders',
    tab: 'scenarios',
    promptText: 'Modify policy weights ("What changes the result?")',
    explanation: 'Increase "Agricultural Preservation Weight" to 0.40 and observe the live recomputation of composite policy scores.',
    actionHint: 'Interact with the sensitivity sliders to test transparent policy weighting.'
  },
  {
    step: 13,
    title: 'Observe Real-Time Score Updates',
    tab: 'scenarios',
    promptText: 'Dynamic recalculation via transparent mathematical formula',
    explanation: 'Demonstrates that the platform does not act as a black-box AI; every formula and parameter is fully exposed.',
    actionHint: 'Notice how the Sustainable Development score responds dynamically.'
  },
  {
    step: 14,
    title: 'Generate Executive Evidence Brief',
    tab: 'overview',
    promptText: 'Compile structured policy report',
    explanation: 'Generates a ready-to-print executive brief distinguishing observed data, research evidence, model predictions, scenario estimates, and assumptions.',
    actionHint: 'Click "Evidence Brief" in the top bar to inspect or print the brief.'
  },
  {
    step: 15,
    title: 'Conclusion: From Land Data to Policy Evidence',
    tab: 'overview',
    promptText: 'Summary for SIH Evaluators',
    explanation: 'The platform successfully bridges satellite telemetry, statutory state planning rules, machine-learning forecasts, and scenario simulation into one traceable intelligence layer for Tamil Nadu.',
    actionHint: 'Demo complete! Platform is ready for ad-hoc exploration.'
  }
];

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === DEMO_STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      onNavigateTab(DEMO_STEPS[nextIdx].tab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      onNavigateTab(DEMO_STEPS[prevIdx].tab);
    }
  };

  const handleJumpToStep = (idx: number) => {
    setCurrentStepIdx(idx);
    onNavigateTab(DEMO_STEPS[idx].tab);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1F2421]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] rounded-2xl shadow-2xl border border-[#E2DDD5] max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-b border-[#E2DDD5] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <TamilEmblemBadge size={32} />
            <div>
              <h2 className="text-sm font-heading font-bold text-[#1F2421]">Interactive SIH 2026 Demo Tour</h2>
              <p className="text-[11px] text-[#5E6460]">Step {currentStep.step} of 15: {currentStep.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#858B87] hover:text-[#1F2421] p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#EFECE6] h-1.5">
          <div
            className="bg-[#9E3A26] h-1.5 transition-all duration-300"
            style={{ width: `${((currentStepIdx + 1) / DEMO_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 bg-white relative">
          <KolamCorner position="top-right" size={40} opacity={0.2} color="#9E3A26" className="absolute top-2 right-2" />

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#9E3A26]/12 text-[#9E3A26] border border-[#9E3A26]/20">
              STEP {currentStep.step}
            </span>
            <span className="text-xs font-semibold text-[#5E6460] uppercase tracking-wider">
              Target View: {currentStep.tab.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <h3 className="text-lg font-heading font-bold text-[#1F2421] leading-tight">
            {currentStep.promptText}
          </h3>

          <div className="p-3.5 bg-[#FAF9F5] rounded-lg border border-[#E2DDD5] text-xs text-[#1F2421] leading-relaxed">
            <p className="font-bold mb-1 text-[#9E3A26]">What is happening here:</p>
            <p className="text-[#383C39]">{currentStep.explanation}</p>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-[#2D5A3D]/10 rounded-lg border border-[#2D5A3D]/25 text-xs text-[#1F432B]">
            <CheckCircle2 className="w-4 h-4 text-[#2D5A3D] shrink-0" />
            <span><strong>Suggested Action:</strong> {currentStep.actionHint}</span>
          </div>

          {/* Quick Jump Step Dots */}
          <div className="pt-2 border-t border-[#E2DDD5]">
            <p className="text-[10px] text-[#5E6460] mb-2 font-bold uppercase tracking-wider">Jump to Step:</p>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => handleJumpToStep(idx)}
                  className={`w-7 h-7 text-xs font-semibold rounded-md flex items-center justify-center transition-all ${
                    idx === currentStepIdx
                      ? 'bg-[#9E3A26] text-white font-bold ring-2 ring-[#9E3A26]/40 shadow-xs'
                      : idx < currentStepIdx
                      ? 'bg-[#2D5A3D]/15 text-[#2D5A3D] font-medium'
                      : 'bg-[#F5F2EA] text-[#5E6460] hover:bg-[#EFECE6]'
                  }`}
                >
                  {s.step}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#FAF9F5] border-t border-[#E2DDD5] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
              isFirst
                ? 'opacity-40 cursor-not-allowed border-[#E2DDD5] text-[#858B87]'
                : 'border-[#E2DDD5] text-[#1F2421] bg-[#F5F2EA] hover:bg-[#EFECE6]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-[#5E6460] font-mono">
            {currentStepIdx + 1} / {DEMO_STEPS.length}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold rounded-md bg-[#9E3A26] hover:bg-[#7F2A19] text-white transition-all shadow-xs"
          >
            <span>{isLast ? 'Complete Tour' : 'Next Step'}</span>
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
