import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import type { Country } from '../../types';
import { getCountriesBySeasons } from '../../data/worldTourData';
import { useGlobeConfig } from '../../hooks/useGlobeConfig';
import { buildPointsData, buildArcsData } from './globeHelpers';
import type { PointData } from './globeHelpers';
import styles from './GlobeView.module.css';

// Lazy import the Globe component
import Globe from 'react-globe.gl';

const EARTH_NIGHT_IMG = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
const NIGHT_SKY_IMG = 'https://unpkg.com/three-globe/example/img/night-sky.png';

interface GlobeViewProps {
  activeSeasons: Set<number>;
  onCountrySelect: (country: Country) => void;
}

export default function GlobeView({ activeSeasons, onCountrySelect }: GlobeViewProps) {
  const globeRef = useRef<GlobeMethods>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const config = useGlobeConfig();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<PointData | null>(null);

  const countries = useMemo(() => getCountriesBySeasons(activeSeasons), [activeSeasons]);
  const pointsData = useMemo(() => buildPointsData(countries), [countries]);
  const arcsData = useMemo(() => buildArcsData(countries), [countries]);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Configure globe after mount
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.pointOfView({ lat: 20, lng: 10, altitude: config.altitude }, 0);

    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = config.autoRotateSpeed;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minDistance = 150;
      controls.maxDistance = 600;
    }
  }, [config.altitude, config.autoRotateSpeed]);

  const handlePointClick = useCallback(
    (point: object) => {
      const p = point as PointData;
      onCountrySelect(p.country);

      // Fly to country
      globeRef.current?.pointOfView(
        { lat: p.lat, lng: p.lng, altitude: 1.8 },
        800
      );
    },
    [onCountrySelect]
  );

  const handlePointHover = useCallback(
    (point: object | null) => {
      setHoveredPoint(point as PointData | null);
    },
    []
  );

  return (
    <div ref={containerRef} className={styles.container}>
      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={EARTH_NIGHT_IMG}
          backgroundImageUrl={NIGHT_SKY_IMG}
          showAtmosphere
          atmosphereColor="#1a3a5c"
          atmosphereAltitude={0.2}
          // Points
          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius="size"
          pointAltitude={0.06}
          pointResolution={12}
          onPointClick={handlePointClick}
          onPointHover={handlePointHover}
          pointLabel={(d: object) => {
            const p = d as PointData;
            return `<div style="
              background: rgba(10,10,46,0.9);
              backdrop-filter: blur(12px);
              border: 1px solid ${p.color};
              border-radius: 8px;
              padding: 6px 12px;
              color: white;
              font-family: 'Space Grotesk', sans-serif;
              font-size: 13px;
              font-weight: 600;
              box-shadow: 0 0 15px ${p.color}40;
              pointer-events: none;
            ">
              ${p.country.name}
              ${p.country.guests.length > 0 ? `<span style="display:block;font-size:10px;color:${p.color};font-weight:400;margin-top:2px;">${p.country.guests.map(g => g.name).join(', ')}</span>` : ''}
            </div>`;
          }}
          // Arcs
          arcsData={arcsData}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcStroke={config.arcStroke}
          arcDashLength={0.5}
          arcDashGap={0.3}
          arcDashAnimateTime={2000}
          arcAltitudeAutoScale={0.35}
          // Rings (pulse effect on points with guests)
          ringsData={pointsData.filter(p => p.country.guests.length > 0)}
          ringLat="lat"
          ringLng="lng"
          ringColor="color"
          ringMaxRadius={3}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1200}
          // Labels
          labelsData={pointsData}
          labelLat="lat"
          labelLng="lng"
          labelText={(d: object) => (d as PointData).country.name}
          labelColor={() => 'rgba(255,255,255,0.7)'}
          labelSize={0.6}
          labelAltitude={0.08}
          labelDotRadius={0}
          labelResolution={2}
          // Interaction
          enablePointerInteraction
        />
      )}

      {/* Hovered country info tooltip for mobile (no hover on touch) */}
      {hoveredPoint && (
        <div className={styles.hoverInfo}>
          <span className={styles.hoverDot} style={{ background: hoveredPoint.color }} />
          <span className={styles.hoverName}>{hoveredPoint.country.name}</span>
          {hoveredPoint.country.guests.length > 0 && (
            <span className={styles.hoverGuest} style={{ color: hoveredPoint.color }}>
              {hoveredPoint.country.guests[0].name}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
