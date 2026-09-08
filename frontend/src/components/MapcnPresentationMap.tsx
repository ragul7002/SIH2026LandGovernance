import React, { useState, useEffect, useRef } from 'react';
import { District, TalukIntelligenceResponse, TalukComparisonResponse, IndustrySuitabilityResponse, TalukFilterResponse } from '../types';
import { EXACT_TAMIL_NADU_DISTRICTS } from '../data/exactDistrictPaths';
import { api } from '../services/api';
import {
  Compass,
  MapPin,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
  Building2,
  Wheat,
  Activity,
  Box,
  Droplets,
  CloudRain,
  Factory,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  FileSpreadsheet,
  Scale,
  ExternalLink,
  HelpCircle,
  Zap,
  Warehouse,
  FileText,
  Map as MapIcon
} from 'lucide-react';
import L from 'leaflet';
import { TamilNaduIsometricMap } from './TamilNaduIsometricMap';
import { DistrictTalukCadastralMap } from './DistrictTalukCadastralMap';
import { KolamCorner, TamilGeometricDivider } from './common/TraditionalMotifs';

interface MapcnPresentationMapProps {
  districts: District[];
  selectedDistrict: District | null;
  selectedTaluk: string;
  onSelectDistrict: (district: District | null) => void;
  onSelectTaluk: (taluk: string) => void;
}

export const MapcnPresentationMap: React.FC<MapcnPresentationMapProps> = ({
  districts,
  selectedDistrict,
  selectedTaluk,
  onSelectDistrict,
  onSelectTaluk
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const districtGeoLayerRef = useRef<L.GeoJSON | null>(null);
  const talukGeoLayerRef = useRef<L.GeoJSON | null>(null);
  const talukMarkerRef = useRef<L.Marker | null>(null);

  const [districtsGeoJson, setDistrictsGeoJson] = useState<any>(null);
  const [allTaluksGeoJson, setAllTaluksGeoJson] = useState<any>(null);
  
  // Default to Cadastral Revenue Map view when a district is selected, otherwise 3D Isometric
  const [mapStyleMode, setMapStyleMode] = useState<'cadastral_revenue' | 'isometric_3d' | 'mapcn_light'>('cadastral_revenue');
  const [hoveredDistrictName, setHoveredDistrictName] = useState<string | null>(null);
  const [hoveredTalukName, setHoveredTalukName] = useState<string | null>(null);

  // Active analytical filter: High Rainfall + High Agricultural Land
  const [isHighRainAgriFilterActive, setIsHighRainAgriFilterActive] = useState<boolean>(false);
  const [highRainAgriData, setHighRainAgriData] = useState<TalukFilterResponse | null>(null);

  // Taluk Intelligence & Analytics States (Strictly Real Datasets)
  const [talukIntelligence, setTalukIntelligence] = useState<TalukIntelligenceResponse | null>(null);
  const [talukComparison, setTalukComparison] = useState<TalukComparisonResponse | null>(null);
  const [loadingIntel, setLoadingIntel] = useState<boolean>(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('textile');
  const [industrySuitability, setIndustrySuitability] = useState<IndustrySuitabilityResponse | null>(null);
  const [showProvenanceModal, setShowProvenanceModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'comparison' | 'suitability'>('intelligence');

  // Quick select popular districts
  const popularDistricts = [
    { id: 'tiruppur', label: '★ Tiruppur (Pilot)' },
    { id: 'coimbatore', label: 'Coimbatore' },
    { id: 'chennai', label: 'Chennai' },
    { id: 'salem', label: 'Salem' },
    { id: 'erode', label: 'Erode' },
    { id: 'madurai', label: 'Madurai' },
    { id: 'thanjavur', label: 'Thanjavur' }
  ];

  // 1. Fetch local exact Tamil Nadu Districts & Taluks GeoJSON
  useEffect(() => {
    fetch('/tamil_nadu_districts_exact.geojson')
      .then((res) => res.json())
      .then((data) => setDistrictsGeoJson(data))
      .catch((err) => console.error('Failed to load local districts GeoJSON:', err));

    fetch('/tamil_nadu_taluks.geojson')
      .then((res) => res.json())
      .then((data) => setAllTaluksGeoJson(data))
      .catch((err) => console.error('Failed to load local taluks GeoJSON:', err));
  }, []);

  // 2. Fetch High Rainfall + High Agriculture Filter Data
  useEffect(() => {
    api.filterHighRainAgriTaluks()
      .then((res) => setHighRainAgriData(res))
      .catch((err) => console.error('Failed to load high rain/agri filter:', err));
  }, []);

  // 3. Load Taluk Intelligence whenever district & taluk change
  useEffect(() => {
    if (!selectedDistrict) {
      setTalukIntelligence(null);
      setTalukComparison(null);
      setIndustrySuitability(null);
      return;
    }

    const distName = selectedDistrict.name;
    const talukName = selectedTaluk || (currentShape?.taluks && currentShape.taluks.length > 0 ? currentShape.taluks[0] : `${distName} North / West`);

    setLoadingIntel(true);

    Promise.all([
      api.getTalukIntelligence(distName, talukName),
      api.getTalukComparison(distName),
      api.getIndustrySuitability(distName, talukName, selectedIndustry)
    ])
      .then(([intelRes, compRes, suitRes]) => {
        setTalukIntelligence(intelRes);
        setTalukComparison(compRes);
        setIndustrySuitability(suitRes);
        setLoadingIntel(false);
      })
      .catch((err) => {
        console.error('Error fetching taluk data:', err);
        setLoadingIntel(false);
      });
  }, [selectedDistrict, selectedTaluk, selectedIndustry]);

  // 4. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current || mapStyleMode !== 'mapcn_light') return;

    const map = L.map(mapContainerRef.current, {
      center: [11.1271, 78.6569],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapStyleMode]);

  // 5. Update Map Layers & GeoJSON Rendering
  useEffect(() => {
    if (!mapInstanceRef.current || mapStyleMode !== 'mapcn_light') return;

    const map = mapInstanceRef.current;

    // Clear previous layers
    if (districtGeoLayerRef.current) {
      map.removeLayer(districtGeoLayerRef.current);
      districtGeoLayerRef.current = null;
    }
    if (talukGeoLayerRef.current) {
      map.removeLayer(talukGeoLayerRef.current);
      talukGeoLayerRef.current = null;
    }

    // A. Render Statewide Districts
    if (districtsGeoJson) {
      districtGeoLayerRef.current = L.geoJSON(districtsGeoJson, {
        style: (feature) => {
          const dName = feature?.properties?.district || feature?.properties?.dtname || feature?.properties?.NAME || '';
          const isSelected = selectedDistrict && dName.toLowerCase().includes(selectedDistrict.name.toLowerCase());
          const isHovered = hoveredDistrictName && dName.toLowerCase().includes(hoveredDistrictName.toLowerCase());

          return {
            fillColor: isSelected ? '#9E3A26' : isHovered ? '#B58D3D' : '#FAF9F5',
            weight: isSelected ? 2.5 : isHovered ? 2 : 1,
            opacity: 1,
            color: isSelected ? '#7F2A19' : '#D8D2C6',
            fillOpacity: isSelected ? 0.35 : isHovered ? 0.25 : 0.8
          };
        },
        onEachFeature: (feature, layer) => {
          const dName = feature?.properties?.district || feature?.properties?.dtname || feature?.properties?.NAME || '';
          layer.on({
            mouseover: () => setHoveredDistrictName(dName),
            mouseout: () => setHoveredDistrictName(null),
            click: () => {
              const matched = districts.find(
                (d) => d.name.toLowerCase() === dName.toLowerCase() || dName.toLowerCase().includes(d.name.toLowerCase())
              );
              if (matched) handleDistrictSelect(matched);
            }
          });
        }
      }).addTo(map);
    }

    // B. Render Taluks if District Selected or Filter Active
    if (allTaluksGeoJson && (selectedDistrict || isHighRainAgriFilterActive)) {
      talukGeoLayerRef.current = L.geoJSON(allTaluksGeoJson, {
        filter: (feature) => {
          const tDist = feature?.properties?.district || feature?.properties?.dtname || '';
          const tName = feature?.properties?.taluk || feature?.properties?.NAME || '';

          if (isHighRainAgriFilterActive && highRainAgriData) {
            return highRainAgriData.matched_taluks.some(
              (m) => m.taluk.toLowerCase() === tName.toLowerCase() || tName.toLowerCase().includes(m.taluk.toLowerCase())
            );
          }

          if (selectedDistrict) {
            return tDist.toLowerCase().includes(selectedDistrict.name.toLowerCase()) ||
                   selectedDistrict.name.toLowerCase().includes(tDist.toLowerCase());
          }

          return false;
        },
        style: (feature) => {
          const tName = feature?.properties?.taluk || feature?.properties?.NAME || '';
          const isTalukSelected = selectedTaluk && tName.toLowerCase().includes(selectedTaluk.toLowerCase());

          if (isHighRainAgriFilterActive) {
            return {
              fillColor: '#2D5A3D',
              weight: 2,
              opacity: 1,
              color: '#1F432B',
              fillOpacity: 0.6
            };
          }

          return {
            fillColor: isTalukSelected ? '#9E3A26' : '#2D5A3D',
            weight: isTalukSelected ? 2.5 : 1.2,
            opacity: 1,
            color: isTalukSelected ? '#7F2A19' : '#D8D2C6',
            fillOpacity: isTalukSelected ? 0.6 : 0.25
          };
        },
        onEachFeature: (feature, layer) => {
          const tName = feature?.properties?.taluk || feature?.properties?.NAME || '';
          layer.on({
            mouseover: () => setHoveredTalukName(tName),
            mouseout: () => setHoveredTalukName(null),
            click: () => handleTalukSelect(tName)
          });
        }
      }).addTo(map);
    }
  }, [mapStyleMode, districtsGeoJson, allTaluksGeoJson, selectedDistrict, selectedTaluk, isHighRainAgriFilterActive, highRainAgriData, districts]);

  // Handle District Selection
  const handleDistrictSelect = (d: District | null) => {
    onSelectDistrict(d);
    onSelectTaluk('');

    if (d) {
      setMapStyleMode('cadastral_revenue');
    }

    if (mapInstanceRef.current) {
      if (d) {
        mapInstanceRef.current.flyTo([d.lat || 11.1075, d.lon || 77.3411], 9, {
          duration: 1.2
        });
      } else {
        mapInstanceRef.current.flyTo([11.1271, 78.6569], 7, {
          duration: 1.2
        });
      }
    }
  };

  // Handle Taluk Selection
  const handleTalukSelect = (talukName: string) => {
    onSelectTaluk(talukName);

    if (mapInstanceRef.current && selectedDistrict) {
      if (!talukName) {
        mapInstanceRef.current.flyTo([selectedDistrict.lat || 11.1075, selectedDistrict.lon || 77.3411], 9, {
          duration: 1.0
        });
        if (talukMarkerRef.current) {
          mapInstanceRef.current.removeLayer(talukMarkerRef.current);
          talukMarkerRef.current = null;
        }
      } else {
        const coordsMap: Record<string, [number, number]> = {
          'Avinashi': [11.193, 77.269],
          'Tiruppur North': [11.145, 77.341],
          'Tiruppur South': [11.082, 77.355],
          'Palladam': [10.998, 77.291],
          'Kangeyam': [11.005, 77.561],
          'Dharapuram': [10.728, 77.526],
          'Udumalaipettai': [10.583, 77.248],
          'Madathukulam': [10.534, 77.379]
        };

        const target = coordsMap[talukName] || [selectedDistrict.lat || 11.1075, selectedDistrict.lon || 77.3411];
        mapInstanceRef.current.flyTo(target, 11, { duration: 1.2 });

        if (talukMarkerRef.current) {
          mapInstanceRef.current.removeLayer(talukMarkerRef.current);
        }

        const customIcon = L.divIcon({
          className: 'mapcn-taluk-pin',
          html: `<div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-[#9E3A26] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-[#9E3A26] border-2 border-white shadow-md"></span>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(target, { icon: customIcon }).addTo(mapInstanceRef.current);
        marker.bindPopup(`<strong>${talukName} Taluk</strong><br/><span class="text-xs text-[#5E6460]">${selectedDistrict.name} District</span>`).openPopup();
        talukMarkerRef.current = marker;
      }
    }
  };

  const currentShape = EXACT_TAMIL_NADU_DISTRICTS.find(
    (d) => d.id === selectedDistrict?.id || d.name.toLowerCase() === selectedDistrict?.name?.toLowerCase()
  );

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E2DDD5] shadow-2xs space-y-3 relative overflow-hidden">
        <KolamCorner position="top-right" size={32} opacity={0.15} color="#9E3A26" className="absolute top-1 right-1" />

        {/* Row 1: Header + View Style Switcher + High Rain/Agri Filter Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2D5A3D] animate-pulse" />
            <span className="font-heading font-extrabold text-sm text-[#1F2421] tracking-tight">
              Tamil Nadu State Administrative GIS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D5A3D]/10 text-[#2D5A3D] border border-[#2D5A3D]/25">
              Exact Boundaries • Grounded in Telemetry
            </span>

            {/* High Rain + High Agri Analytical Filter Button */}
            <button
              onClick={() => setIsHighRainAgriFilterActive(!isHighRainAgriFilterActive)}
              className={`text-xs px-3 py-1 rounded-full font-bold transition-all flex items-center space-x-1.5 border ${
                isHighRainAgriFilterActive
                  ? 'bg-[#2D5A3D] text-white border-[#1F432B] shadow-xs'
                  : 'bg-[#2D5A3D]/10 text-[#2D5A3D] border-[#2D5A3D]/30 hover:bg-[#2D5A3D]/20'
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              <span>Filter: High Rainfall + High Agri</span>
              {highRainAgriData && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isHighRainAgriFilterActive ? 'bg-[#1F432B] text-white' : 'bg-[#2D5A3D]/20 text-[#2D5A3D]'}`}>
                  {highRainAgriData.total_matches}
                </span>
              )}
            </button>
          </div>

          {/* Presentation Style Toggle */}
          <div className="flex items-center p-1 bg-[#F5F2EA] rounded-xl border border-[#E2DDD5] text-xs">
            {selectedDistrict && (
              <button
                onClick={() => setMapStyleMode('cadastral_revenue')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                  mapStyleMode === 'cadastral_revenue'
                    ? 'bg-[#9E3A26] text-white shadow-xs'
                    : 'text-[#5E6460] hover:text-[#1F2421]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Split Taluk Revenue Map</span>
              </button>
            )}
            <button
              onClick={() => setMapStyleMode('isometric_3d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                mapStyleMode === 'isometric_3d'
                  ? 'bg-white text-[#1F2421] shadow-xs font-bold'
                  : 'text-[#5E6460] hover:text-[#1F2421]'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-[#5E6460]" />
              <span>3D State Map</span>
            </button>
            <button
              onClick={() => setMapStyleMode('mapcn_light')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                mapStyleMode === 'mapcn_light'
                  ? 'bg-white text-[#1F2421] shadow-xs font-bold'
                  : 'text-[#5E6460] hover:text-[#1F2421]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#9E3A26]" />
              <span>Vector Canvas</span>
            </button>
          </div>
        </div>

        {/* High Rainfall + High Agri Active Banner */}
        {isHighRainAgriFilterActive && (
          <div className="p-2.5 rounded-xl bg-[#2D5A3D]/10 border border-[#2D5A3D]/30 text-xs text-[#1F432B] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#2D5A3D] shrink-0" />
              <div>
                <strong>Active Analytical Filter:</strong> Taluks with Agricultural Land ≥ 50% AND Post-Monsoon Moisture (NDWI) ≥ -0.42.
                <span className="text-[#2D5A3D] text-[11px] block mt-0.5">
                  Methodology: Quantile-based classification on authentic Sentinel-2 STAC and IMD long-term rainfall series.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsHighRainAgriFilterActive(false)}
              className="text-[11px] text-[#2D5A3D] underline font-bold hover:text-[#1F432B] ml-3 shrink-0"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Row 2: Quick District Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E2DDD5]">
          <span className="text-[11px] font-bold text-[#858B87] mr-1 uppercase tracking-wider">
            Quick Jump:
          </span>
          <button
            onClick={() => handleDistrictSelect(null)}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all border ${
              !selectedDistrict
                ? 'bg-[#1F2421] text-white border-[#1F2421] shadow-2xs'
                : 'bg-white text-[#5E6460] border-[#E2DDD5] hover:bg-[#F5F2EA]'
            }`}
          >
            All Tamil Nadu
          </button>
          {popularDistricts.map((p) => {
            const isMatch = selectedDistrict?.id === p.id;
            const matchedObj = EXACT_TAMIL_NADU_DISTRICTS.find((d) => d.id === p.id);
            return (
              <button
                key={p.id}
                onClick={() => matchedObj && handleDistrictSelect(matchedObj as any)}
                className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all border ${
                  isMatch
                    ? 'bg-[#9E3A26] text-white border-[#9E3A26] shadow-2xs font-bold'
                    : 'bg-white text-[#1F2421] border-[#E2DDD5] hover:bg-[#F5F2EA]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Row 3: Dropdown Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-[#E2DDD5] text-xs">
          {/* Dropdown 1: District */}
          <div className="space-y-1">
            <label className="font-bold text-[#1F2421] block">
              1. Select District ({EXACT_TAMIL_NADU_DISTRICTS.length} Districts):
            </label>
            <select
              value={selectedDistrict?.id || ''}
              onChange={(e) => {
                const shape = EXACT_TAMIL_NADU_DISTRICTS.find((d) => d.id === e.target.value);
                handleDistrictSelect(shape ? (shape as any) : null);
              }}
              className="w-full bg-white border border-[#E2DDD5] rounded-lg px-3 py-2 font-semibold text-[#1F2421] focus:ring-1 focus:ring-[#9E3A26] focus:outline-hidden cursor-pointer"
            >
              <option value="">-- Choose a District --</option>
              {EXACT_TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.pilot_focus ? '★ (Pilot)' : ''} ({d.region} Region)
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 2: Area / Taluk */}
          <div className="space-y-1">
            <label className="font-bold text-[#1F2421] block">
              2. Select Taluk in {selectedDistrict ? selectedDistrict.name : 'District'}:
            </label>
            <select
              value={selectedTaluk}
              onChange={(e) => handleTalukSelect(e.target.value)}
              disabled={!selectedDistrict}
              className={`w-full border rounded-lg px-3 py-2 font-semibold focus:ring-1 focus:ring-[#9E3A26] focus:outline-hidden cursor-pointer ${
                selectedDistrict
                  ? 'bg-white border-[#E2DDD5] text-[#1F2421]'
                  : 'bg-[#F5F2EA] border-[#E2DDD5] text-[#858B87] cursor-not-allowed'
              }`}
            >
              <option value="">
                {selectedDistrict ? `-- Select Taluk in ${selectedDistrict.name} --` : '-- Choose District First --'}
              </option>
              {currentShape?.taluks?.map((tname) => (
                <option key={tname} value={tname}>
                  {tname} Taluk
                </option>
              ))}
            </select>
          </div>

          {/* Active Focus Display */}
          <div className="flex flex-col justify-center p-2.5 rounded-lg bg-[#F5F2EA] border border-[#E2DDD5]">
            <span className="text-[10px] font-bold text-[#858B87] uppercase tracking-wider">Active Focus</span>
            <div className="text-xs font-bold text-[#1F2421] truncate">
              {selectedDistrict ? `${selectedDistrict.name} District` : 'State of Tamil Nadu'}
              {selectedTaluk ? ` → ${selectedTaluk} Taluk` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Main Presentation Stage */}
      {selectedDistrict ? (
        mapStyleMode === 'isometric_3d' ? (
          <TamilNaduIsometricMap
            districts={districts}
            selectedDistrict={selectedDistrict}
            selectedTaluk={selectedTaluk}
            onSelectDistrict={handleDistrictSelect}
            onSelectTaluk={handleTalukSelect}
          />
        ) : mapStyleMode === 'mapcn_light' ? (
          <div className="relative rounded-2xl border border-[#E2DDD5] overflow-hidden shadow-xs h-[560px] bg-[#F5F2EA]">
            {/* Leaflet Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* FLOATING CARD 1: District Overview Stat Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-[#FAF9F5]/95 backdrop-blur-md p-4 rounded-xl border border-[#E2DDD5] shadow-md text-xs space-y-2 max-w-[260px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#858B87]">
                  Governance Region
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#9E3A26]/10 text-[#9E3A26] border border-[#9E3A26]/20">
                  Tamil Nadu
                </span>
              </div>

              <div className="text-base font-heading font-extrabold text-[#1F2421]">
                {selectedDistrict ? `${selectedDistrict.name} District` : 'Tamil Nadu State'}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E2DDD5] text-[11px]">
                <div>
                  <span className="text-[#858B87] block text-[10px]">Total Area</span>
                  <span className="font-bold text-[#1F2421] font-mono">
                    {selectedDistrict ? `${selectedDistrict.area_sqkm.toLocaleString()} km²` : '130,060 km²'}
                  </span>
                </div>
                <div>
                  <span className="text-[#858B87] block text-[10px]">Population</span>
                  <span className="font-bold text-[#1F2421] font-mono">
                    {selectedDistrict ? `${(selectedDistrict.population / 100000).toFixed(1)}L` : '7.21 Cr'}
                  </span>
                </div>
              </div>

              {selectedDistrict && (
                <p className="text-[11px] text-[#5E6460] pt-1 border-t border-[#E2DDD5] leading-tight">
                  {selectedDistrict.description}
                </p>
              )}
            </div>

            {/* FLOATING CARD 2: Sub-Areas / Taluks Quick List */}
            {selectedDistrict && (
              <div className="absolute top-4 right-4 z-20 bg-[#FAF9F5]/95 backdrop-blur-md p-4 rounded-xl border border-[#E2DDD5] shadow-md text-xs space-y-2.5 max-w-[280px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2421] text-xs">
                    Taluk Boundaries ({currentShape?.taluks?.length || 0})
                  </span>
                  <span className="text-[10px] text-[#858B87]">Click to focus</span>
                </div>

                <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pr-1">
                  {currentShape?.taluks?.map((tname) => {
                    const isMatch = selectedTaluk === tname;
                    return (
                      <button
                        key={tname}
                        onClick={() => handleTalukSelect(tname)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-all ${
                          isMatch
                            ? 'bg-[#9E3A26] text-white font-bold shadow-2xs'
                            : 'bg-white text-[#5E6460] border border-[#E2DDD5] hover:bg-[#F5F2EA]'
                        }`}
                      >
                        {tname}
                      </button>
                    );
                  })}
                </div>

                {selectedTaluk && (
                  <div className="p-2 rounded bg-[#9E3A26]/10 border border-[#9E3A26]/20 text-[11px] text-[#9E3A26]">
                    <strong>Selected Taluk:</strong> {selectedTaluk}
                  </div>
                )}
              </div>
            )}

            {/* FLOATING CARD 3: Legend */}
            <div className="absolute bottom-4 left-4 z-20 bg-[#FAF9F5]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#E2DDD5] shadow-md text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#858B87] block">
                Boundary &amp; Layer Key
              </span>
              <div className="flex items-center space-x-3 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-white border border-[#D8D2C6]" />
                  <span className="text-[#5E6460]">District Boundary</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-[#9E3A26]/30 border border-[#9E3A26]" />
                  <span className="text-[#5E6460]">Taluk Boundary</span>
                </div>
                {isHighRainAgriFilterActive && (
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded bg-[#2D5A3D] border border-[#1F432B]" />
                    <span className="text-[#2D5A3D] font-bold">High Rain + Agri</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* OFFICIAL REVENUE DISTRICT TALUK CADASTRAL MAP VIEW */
          <DistrictTalukCadastralMap
            district={selectedDistrict}
            selectedTaluk={selectedTaluk}
            onSelectTaluk={handleTalukSelect}
            onBackToStateMap={() => handleDistrictSelect(null)}
          />
        )
      ) : (
        /* STATE LEVEL: Complete Tamil Nadu Administrative State Map */
        <TamilNaduIsometricMap
          districts={districts}
          selectedDistrict={null}
          selectedTaluk=""
          onSelectDistrict={handleDistrictSelect}
          onSelectTaluk={handleTalukSelect}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: TALUK INTELLIGENCE & COMPARATIVE ANALYTICS & INDUSTRY SUITABILITY */}
      {/* ========================================================================= */}
      {selectedDistrict && (
        <div className="bg-[#FAF9F5] rounded-2xl border border-[#E2DDD5] shadow-xs p-6 space-y-5 relative overflow-hidden">
          <KolamCorner position="top-right" size={36} opacity={0.15} color="#9E3A26" className="absolute top-2 right-2" />

          {/* Tabs Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2DDD5] pb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-[#9E3A26]" />
              <div>
                <h3 className="text-base font-heading font-extrabold text-[#1F2421]">
                  {selectedTaluk ? `${selectedTaluk} Taluk Intelligence` : `${selectedDistrict.name} District Taluk Analysis`}
                </h3>
                <p className="text-xs text-[#5E6460]">
                  Evidence-based metrics computed from authentic Sentinel-2 STAC, Cadastral survey parcels, IMD rainfall, and Census 2011 datasets.
                </p>
              </div>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex items-center p-1 bg-[#F5F2EA] rounded-xl border border-[#E2DDD5] text-xs self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('intelligence')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'intelligence' ? 'bg-white text-[#9E3A26] shadow-2xs' : 'text-[#5E6460] hover:text-[#1F2421]'
                }`}
              >
                Taluk Indicators
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'comparison' ? 'bg-white text-[#9E3A26] shadow-2xs' : 'text-[#5E6460] hover:text-[#1F2421]'
                }`}
              >
                District Taluk Comparison
              </button>
              <button
                onClick={() => setActiveTab('suitability')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'suitability' ? 'bg-white text-[#9E3A26] shadow-2xs' : 'text-[#5E6460] hover:text-[#1F2421]'
                }`}
              >
                Industry Suitability
              </button>
            </div>
          </div>

          {loadingIntel ? (
            <div className="py-12 text-center text-[#5E6460] text-xs flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-[#9E3A26] border-t-transparent rounded-full animate-spin" />
              <span>Loading authentic dataset metrics...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: TALUK INDICATORS */}
              {activeTab === 'intelligence' && talukIntelligence && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1: Rainfall Status */}
                    <div className="p-4 rounded-xl bg-white border border-[#E2DDD5] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#5E6460] uppercase tracking-wider flex items-center space-x-1">
                          <CloudRain className="w-3.5 h-3.5 text-[#2D5A3D]" />
                          <span>Rainfall &amp; Moisture</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          talukIntelligence.metrics.rainfall_status === 'High'
                            ? 'bg-[#2D5A3D]/12 text-[#2D5A3D]'
                            : talukIntelligence.metrics.rainfall_status === 'Moderate'
                            ? 'bg-[#B58D3D]/15 text-[#996B1E]'
                            : 'bg-[#9E3A26]/12 text-[#9E3A26]'
                        }`}>
                          {talukIntelligence.metrics.rainfall_status}
                        </span>
                      </div>
                      <div className="text-lg font-heading font-extrabold text-[#1F2421]">
                        {talukIntelligence.metrics.rainfall_category}
                      </div>
                      <div className="text-[11px] text-[#5E6460]">
                        IMD State Normal: <strong>{talukIntelligence.metrics.rainfall_normal_mm} mm/yr</strong>
                      </div>
                    </div>

                    {/* Metric 2: Agricultural Land % */}
                    <div className="p-4 rounded-xl bg-white border border-[#E2DDD5] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#5E6460] uppercase tracking-wider flex items-center space-x-1">
                          <Wheat className="w-3.5 h-3.5 text-[#2D5A3D]" />
                          <span>Agricultural Land %</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D5A3D]/12 text-[#2D5A3D]">
                          {talukIntelligence.metrics.agricultural_land_pct ? `${talukIntelligence.metrics.agricultural_land_pct}%` : 'Available'}
                        </span>
                      </div>
                      <div className="text-lg font-heading font-extrabold text-[#2D5A3D]">
                        {talukIntelligence.metrics.agricultural_land_pct ? `${talukIntelligence.metrics.agricultural_land_pct}%` : 'Data in LULC'}
                      </div>
                      <div className="text-[11px] text-[#5E6460]">
                        NDVI Greenery: <strong>{talukIntelligence.metrics.ndvi_post_monsoon ?? 'N/A'}</strong>
                      </div>
                    </div>

                    {/* Metric 3: Industrial Activity & NDBI */}
                    <div className="p-4 rounded-xl bg-white border border-[#E2DDD5] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#5E6460] uppercase tracking-wider flex items-center space-x-1">
                          <Factory className="w-3.5 h-3.5 text-[#9E3A26]" />
                          <span>Industrial Intensity</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9E3A26]/12 text-[#9E3A26]">
                          NDBI {talukIntelligence.metrics.ndbi_dry_summer ? talukIntelligence.metrics.ndbi_dry_summer.toFixed(3) : 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm font-heading font-extrabold text-[#1F2421] leading-tight">
                        {talukIntelligence.metrics.industrial_activity}
                      </div>
                      <div className="text-[11px] text-[#5E6460]">
                        Recorded Units: <strong>{talukIntelligence.metrics.industrial_units_count ?? 0} units</strong>
                      </div>
                    </div>

                    {/* Metric 4: Water Availability (NDWI) */}
                    <div className="p-4 rounded-xl bg-white border border-[#E2DDD5] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#5E6460] uppercase tracking-wider flex items-center space-x-1">
                          <Droplets className="w-3.5 h-3.5 text-[#2D5A3D]" />
                          <span>Water Availability</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D5A3D]/12 text-[#2D5A3D]">
                          NDWI {talukIntelligence.metrics.ndwi_post_monsoon ? talukIntelligence.metrics.ndwi_post_monsoon.toFixed(3) : 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm font-heading font-extrabold text-[#1F2421] leading-tight">
                        {talukIntelligence.metrics.water_availability}
                      </div>
                      <div className="text-[11px] text-[#5E6460]">
                        Dry Summer NDWI: <strong>{talukIntelligence.metrics.ndwi_dry_summer ?? 'N/A'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metrics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Population & Density */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E2DDD5] text-xs space-y-1">
                      <span className="text-[10px] font-bold text-[#858B87] uppercase tracking-wider">Demographics (Census 2011)</span>
                      <div className="font-bold text-[#1F2421] text-sm font-mono">
                        {talukIntelligence.metrics.population ? `${talukIntelligence.metrics.population.toLocaleString()} persons` : 'District Level Census'}
                      </div>
                      <div className="text-[#5E6460] text-[11px]">
                        Density: <strong>{talukIntelligence.metrics.population_density ?? 'N/A'} / km²</strong> • Urban Ratio: <strong>{talukIntelligence.metrics.urbanisation_pct ? `${talukIntelligence.metrics.urbanisation_pct}%` : 'N/A'}</strong>
                      </div>
                    </div>

                    {/* Infrastructure & Logistics */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E2DDD5] text-xs space-y-1">
                      <span className="text-[10px] font-bold text-[#858B87] uppercase tracking-wider">Infrastructure &amp; Logistics</span>
                      <div className="font-bold text-[#1F2421] text-sm">
                        {talukIntelligence.metrics.infrastructure_access}
                      </div>
                      <div className="text-[#5E6460] text-[11px]">
                        Corridor Access: <strong>Connected via National &amp; State Highways</strong>
                      </div>
                    </div>

                    {/* Soil Condition */}
                    <div className="p-3.5 rounded-xl bg-[#FDF8EE] border border-[#B58D3D]/30 text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 text-[#996B1E] font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#996B1E]" />
                        <span>Soil Chemical Condition</span>
                      </div>
                      <div className="font-bold text-[#1F2421] text-xs">
                        {talukIntelligence.metrics.soil_condition.status}
                      </div>
                      <div className="text-[#5E6460] text-[11px] leading-tight">
                        {talukIntelligence.metrics.soil_condition.notice}
                      </div>
                    </div>
                  </div>

                  {/* Provenance Expander */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowProvenanceModal(!showProvenanceModal)}
                      className="text-xs font-bold text-[#9E3A26] hover:text-[#7F2A19] flex items-center space-x-1.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>{showProvenanceModal ? 'Hide Data Provenance & Methodology' : 'View Data Provenance & Calculation Formulas'}</span>
                    </button>

                    {showProvenanceModal && (
                      <div className="mt-3 p-4 rounded-xl bg-white border border-[#E2DDD5] space-y-3 text-xs">
                        <h4 className="font-heading font-bold text-[#1F2421] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#2D5A3D]" />
                          <span>Data Provenance Table (Grounded in Verified Files)</span>
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-[#E2DDD5] text-[#5E6460] text-[11px]">
                                <th className="pb-1.5 font-bold">Indicator</th>
                                <th className="pb-1.5 font-bold">Dataset File</th>
                                <th className="pb-1.5 font-bold">Field / Method</th>
                                <th className="pb-1.5 font-bold">Vintage</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ECE7DF] text-[11px]">
                              {talukIntelligence.provenance.map((p, idx) => (
                                <tr key={idx} className="hover:bg-[#FAF9F5]">
                                  <td className="py-2 font-semibold text-[#1F2421]">{p.indicator}</td>
                                  <td className="py-2 text-[#9E3A26] font-mono text-[10px]">{p.dataset}</td>
                                  <td className="py-2 text-[#5E6460]">{p.calculation}</td>
                                  <td className="py-2 text-[#858B87]">{p.vintage}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: DISTRICT TALUK COMPARISON */}
              {activeTab === 'comparison' && talukComparison && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {talukComparison.rankings.map((rk, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-[#E2DDD5] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#9E3A26] tracking-wider block">
                          {rk.category}
                        </span>
                        <div className="font-heading font-extrabold text-[#1F2421] text-sm">
                          {rk.top_taluk}
                        </div>
                        <span className="text-[11px] font-bold text-[#2D5A3D] bg-[#2D5A3D]/10 px-2 py-0.5 rounded-md inline-block">
                          {rk.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-x-auto border border-[#E2DDD5] rounded-xl bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5F2EA] border-b border-[#E2DDD5] text-[#5E6460] text-[11px]">
                        <tr>
                          <th className="p-3 font-bold">Taluk</th>
                          <th className="p-3 font-bold">Rainfall / Moisture</th>
                          <th className="p-3 font-bold">Agri Land %</th>
                          <th className="p-3 font-bold">NDVI Greenery</th>
                          <th className="p-3 font-bold">NDBI Built-up</th>
                          <th className="p-3 font-bold">Industrial Activity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ECE7DF]">
                        {talukComparison.taluks.map((tRec, idx) => {
                          const isSelected = selectedTaluk && tRec.taluk.toLowerCase().includes(selectedTaluk.toLowerCase());
                          return (
                            <tr
                              key={idx}
                              onClick={() => handleTalukSelect(tRec.taluk)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#9E3A26]/10 font-bold' : 'hover:bg-[#FAF9F5]'
                              }`}
                            >
                              <td className="p-3 text-[#1F2421] font-bold flex items-center space-x-1.5">
                                <span>{tRec.taluk}</span>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#9E3A26]" />}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  tRec.rainfall_status === 'High' ? 'bg-[#2D5A3D]/12 text-[#2D5A3D]' : 'bg-[#B58D3D]/15 text-[#996B1E]'
                                }`}>
                                  {tRec.rainfall_status}
                                </span>
                              </td>
                              <td className="p-3 text-[#2D5A3D] font-bold font-mono">
                                {tRec.agricultural_land_pct ? `${tRec.agricultural_land_pct}%` : 'N/A'}
                              </td>
                              <td className="p-3 text-[#5E6460] font-mono">
                                {tRec.ndvi_greenery ?? 'N/A'}
                              </td>
                              <td className="p-3 text-[#5E6460] font-mono">
                                {tRec.ndbi_built_up ? tRec.ndbi_built_up.toFixed(3) : 'N/A'}
                              </td>
                              <td className="p-3 text-[#1F2421]">
                                {tRec.industrial_activity}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-[#E2DDD5] text-[11px] text-[#5E6460] flex items-center justify-between">
                    <div>
                      <strong>District Averages:</strong> Agri Land: <strong>{talukComparison.district_averages.avg_agricultural_land_pct ?? 'N/A'}%</strong> • Avg NDBI: <strong>{talukComparison.district_averages.avg_ndbi_built_up ?? 'N/A'}</strong> • Normal Rainfall: <strong>{talukComparison.district_averages.rainfall_normal_mm} mm</strong>
                    </div>
                    <span className="text-[10px] text-[#858B87]">Calculated from authentic satellite &amp; survey data</span>
                  </div>
                </div>
              )}

              {/* TAB 3: INDUSTRY SUITABILITY */}
              {activeTab === 'suitability' && (
                <div className="space-y-4 text-xs">
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#E2DDD5]">
                    <span className="text-[11px] font-bold text-[#858B87] uppercase tracking-wider mr-1">
                      Select Sector:
                    </span>
                    {[
                      { id: 'textile', label: 'Textile / Garments', icon: Factory },
                      { id: 'food', label: 'Food & Agro Processing', icon: Wheat },
                      { id: 'warehouse', label: 'Warehousing & Logistics', icon: Warehouse },
                      { id: 'renewable', label: 'Renewable Energy (Solar/Wind)', icon: Zap },
                      { id: 'electronics', label: 'Electronics / Light Mfg', icon: Building2 }
                    ].map((ind) => {
                      const IconComp = ind.icon;
                      const isChosen = selectedIndustry === ind.id;
                      return (
                        <button
                          key={ind.id}
                          onClick={() => setSelectedIndustry(ind.id)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 border ${
                            isChosen
                              ? 'bg-[#9E3A26] text-white border-[#7F2A19] shadow-2xs'
                              : 'bg-white text-[#1F2421] border-[#E2DDD5] hover:bg-[#F5F2EA]'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          <span>{ind.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {industrySuitability && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="lg:col-span-7 space-y-4">
                        <div className="p-4 rounded-xl bg-white border border-[#E2DDD5] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858B87]">
                              Industry Suitability Assessment
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              industrySuitability.suitability_grade === 'High'
                                ? 'bg-[#2D5A3D]/12 text-[#2D5A3D] border border-[#2D5A3D]/20'
                                : 'bg-[#B58D3D]/15 text-[#996B1E] border border-[#B58D3D]/30'
                            }`}>
                              {industrySuitability.suitability_grade} Suitability
                            </span>
                          </div>

                          <div className="flex items-baseline space-x-3">
                            <div className="text-3xl font-heading font-black text-[#1F2421] tracking-tight">
                              {industrySuitability.suitability_score}
                            </div>
                            <div className="text-[#858B87] text-sm font-semibold">
                              / 100 Score
                            </div>
                            <div className="text-xs text-[#5E6460] ml-auto">
                              Target: <strong>{industrySuitability.taluk}</strong>
                            </div>
                          </div>

                          <p className="text-xs text-[#1F2421] leading-relaxed pt-1 border-t border-[#E2DDD5]">
                            <strong>Decision Support Recommendation:</strong> {industrySuitability.recommendation}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#2D5A3D]/8 border border-[#2D5A3D]/25 space-y-2">
                          <h4 className="font-bold text-[#1F432B] text-xs flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#2D5A3D]" />
                            <span>Positive Ground Factors (Empirically Observed):</span>
                          </h4>
                          <ul className="space-y-1 text-[11px] text-[#1F432B]">
                            {industrySuitability.positive_factors.map((pos, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="text-[#2D5A3D] font-bold">✓</span>
                                <span>{pos}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {industrySuitability.constraints.length > 0 && (
                          <div className="p-4 rounded-xl bg-[#FDF8EE] border border-[#B58D3D]/30 space-y-2">
                            <h4 className="font-bold text-[#996B1E] text-xs flex items-center space-x-1.5">
                              <AlertTriangle className="w-4 h-4 text-[#996B1E]" />
                              <span>Statutory &amp; Environmental Constraints:</span>
                            </h4>
                            <ul className="space-y-1 text-[11px] text-[#5E6460]">
                              {industrySuitability.constraints.map((c, idx) => (
                                <li key={idx} className="flex items-start space-x-1.5">
                                  <span className="text-[#996B1E] font-bold">⚠</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[#1F2421] text-xs">
                            Alternative Taluks in {selectedDistrict.name}
                          </h4>
                          <span className="text-[10px] text-[#858B87]">Comparative Ranking</span>
                        </div>

                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                          {industrySuitability.alternative_taluk_rankings.map((alt, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleTalukSelect(alt.taluk)}
                              className="p-2.5 rounded-xl border border-[#E2DDD5] bg-white hover:border-[#9E3A26] hover:bg-[#FAF9F5] cursor-pointer transition-all flex items-center justify-between text-xs"
                            >
                              <div>
                                <div className="font-bold text-[#1F2421]">{alt.taluk}</div>
                                <div className="text-[10px] text-[#5E6460]">
                                  Agri %: <strong>{alt.agricultural_land_pct}%</strong> • NDBI: <strong>{alt.ndbi_built_up.toFixed(3)}</strong>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                  alt.suitability_status === 'High' ? 'bg-[#2D5A3D]/12 text-[#2D5A3D]' : 'bg-[#F5F2EA] text-[#5E6460]'
                                }`}>
                                  {alt.suitability_score} / 100
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-[#E2DDD5] text-[10px] text-[#5E6460] leading-tight">
                          <strong>Methodology:</strong> Multi-Criteria Evaluation (MCE) applying transparent weights to Sentinel-2 NDBI/NDWI, Cadastral survey agricultural parcel areas, and transportation layers.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
