import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Map as MapIcon,
  GitCommit,
  TrendingUp,
  Sliders,
  FileCheck2,
  Database,
  Cpu,
  Settings,
  X
} from 'lucide-react';
import { KolamCorner, TempleSkylineIllustration, TamilEmblemBadge } from './common/TraditionalMotifs';

export type NavTab =
  | 'overview'
  | 'research'
  | 'gis'
  | 'land_change'
  | 'predictions'
  | 'scenarios'
  | 'evidence'
  | 'datasets'
  | 'models'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'research', label: 'Research & Policy', icon: BookOpen, badge: 'RAG' },
    { id: 'gis', label: 'GIS Explorer', icon: MapIcon, badge: 'Ask-Map' },
    { id: 'land_change', label: 'Land Change', icon: GitCommit, badge: 'Matrix' },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp, badge: 'XAI' },
    { id: 'scenarios', label: 'Scenarios', icon: Sliders, badge: '3 Models' },
    { id: 'evidence', label: 'Evidence Chain', icon: FileCheck2, badge: 'Audit' },
    { id: 'datasets', label: 'Datasets', icon: Database, badge: 'Quality' },
    { id: 'models', label: 'Models & Monitoring', icon: Cpu, badge: 'Eval' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <>
      {/* Dimmed backdrop when sidebar drawer is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#1F2421]/35 backdrop-blur-xs z-40 transition-opacity duration-300 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Slide-over Drawer Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-[#FAF9F5] border-r border-[#E2DDD5] shadow-2xl flex flex-col z-50 select-none transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header with State Seal and Close Icon */}
        <div className="p-4 border-b border-[#E2DDD5] bg-[#F5EFE6] relative overflow-hidden flex items-center justify-between">
          <KolamCorner position="top-right" size={28} opacity={0.25} color="#C04A26" className="absolute top-1 right-8 pointer-events-none" />
          
          <div className="flex items-center space-x-2.5">
            <TamilEmblemBadge size={32} />
            <div>
              <div className="text-xs font-serif font-bold text-[#1F2421]">Platform Navigation</div>
              <div className="text-[10px] text-[#5E6460]">Land Governance &amp; Spatial AI</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-[#FAF5EC] border border-[#E2DDD5] text-[#5E6460] hover:text-[#C04A26] transition-colors cursor-pointer shrink-0 z-10"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* State Geospatial Coverage Header */}
        <div className="px-4 py-3 border-b border-[#E2DDD5] bg-[#FAF5EC] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#858B87] block">Regional Coverage</span>
            <span className="text-xs font-serif font-bold text-[#1F2421]">For South India</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E6B48]/12 text-[#1E6B48] border border-[#1E6B48]/25">
            5 States
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id as NavTab);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C04A26]/12 text-[#C04A26] border border-[#C04A26]/35 font-bold shadow-2xs'
                    : 'text-[#5E6460] hover:bg-[#F5EFE6] hover:text-[#1F2421] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#C04A26]' : 'text-[#858B87]'
                    }`}
                  />
                  <span className="font-sans">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-[#C04A26]/20 text-[#A33B1C]'
                        : 'bg-[#EAE4D9] text-[#5E6460]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Institutional Footer with Subtle Temple Silhouette */}
        <div className="p-3.5 border-t border-[#E2DDD5] bg-[#F5EFE6]/70 relative overflow-hidden">
          <TempleSkylineIllustration className="absolute right-0 bottom-0 w-36 h-12 opacity-15 pointer-events-none text-[#C04A26]" />
          <div className="relative z-10 flex items-center justify-between text-[10px] text-[#5E6460]">
            <span className="font-serif font-bold text-[#1F2421]">TN State Spatial GIS</span>
            <span className="font-mono font-semibold bg-white/80 px-1.5 py-0.5 rounded border border-[#E2DDD5]">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
