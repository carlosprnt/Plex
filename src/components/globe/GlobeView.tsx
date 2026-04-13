import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import type { Country } from '../../types';
import { getCountriesBySeasons, getSeasonColor, seasons } from '../../data/worldTourData';
import { useGlobeConfig } from '../../hooks/useGlobeConfig';
import { buildPointsData, buildArcsData } from './globeHelpers';
import type { PointData } from './globeHelpers';
import styles from './GlobeView.module.css';

// Lazy import the Globe component
import Globe from 'react-globe.gl';

const EARTH_NIGHT_IMG = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
const NIGHT_SKY_IMG = 'https://unpkg.com/three-globe/example/img/night-sky.png';

/** Build the ordered journey: all countries sorted by season, then by orderInSeason */
function buildJourney(activeSeasons: Set<number>): Country[] {
  const journey: Country[] = [];
  for (const season of seasons) {
    if (!activeSeasons.has(season.id)) continue;
    const sorted = [...season.countries].sort((a, b) => a.orderInSeason - b.orderInSeason);
    journey.push(...sorted);
  }
  return journey;
}

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

  // Play Recorrido state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentJourneyIndex, setCurrentJourneyIndex] = useState(-1);
  const playingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const countries = useMemo(() => getCountriesBySeasons(activeSeasons), [activeSeasons]);
  const pointsData = useMemo(() => buildPointsData(countries), [countries]);
  const arcsData = useMemo(() => buildArcsData(countries), [countries]);
  const journey = useMemo(() => buildJourney(activeSeasons), [activeSeasons]);

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

  // Play Recorrido animation
  const stopJourney = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    setCurrentJourneyIndex(-1);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Restore auto-rotate
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = config.autoRotateSpeed;
    }
  }, [config.autoRotateSpeed]);

  const playJourney = useCallback(() => {
    if (journey.length === 0) return;

    // Stop auto-rotate during playback
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.autoRotate = false;
    }

    playingRef.current = true;
    setIsPlaying(true);
    setCurrentJourneyIndex(0);

    const FLY_DURATION = 1200;  // ms to fly to country
    const PAUSE_DURATION = 1800; // ms to pause at country

    function flyToIndex(idx: number) {
      if (!playingRef.current || idx >= journey.length) {
        // Journey complete
        playingRef.current = false;
        setIsPlaying(false);
        setCurrentJourneyIndex(-1);
        // Restore auto-rotate
        const c = globeRef.current?.controls();
        if (c) {
          c.autoRotate = true;
          c.autoRotateSpeed = config.autoRotateSpeed;
        }
        return;
      }

      const country = journey[idx];
      setCurrentJourneyIndex(idx);

      globeRef.current?.pointOfView(
        { lat: country.lat, lng: country.lng, altitude: 1.6 },
        FLY_DURATION
      );

      // Wait for fly + pause, then go to next
      timeoutRef.current = setTimeout(() => {
        flyToIndex(idx + 1);
      }, FLY_DURATION + PAUSE_DURATION);
    }

    // Start from a zoomed-out view first, then begin
    globeRef.current?.pointOfView(
      { lat: journey[0].lat, lng: journey[0].lng, altitude: 2.5 },
      600
    );
    timeoutRef.current = setTimeout(() => flyToIndex(0), 800);
  }, [journey, config.autoRotateSpeed]);

  // Clean up on unmount or season change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Stop journey if active seasons change
  useEffect(() => {
    if (isPlaying) stopJourney();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSeasons]);

  const currentCountry = currentJourneyIndex >= 0 ? journey[currentJourneyIndex] : null;

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
      {hoveredPoint && !isPlaying && (
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

      {/* Play Recorrido Controls */}
      <div className={styles.playControls}>
        <button
          className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
          onClick={isPlaying ? stopJourney : playJourney}
          title={isPlaying ? 'Detener recorrido' : 'Play Recorrido'}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span>{isPlaying ? 'Detener' : 'Play Recorrido'}</span>
        </button>
      </div>

      {/* Journey progress overlay */}
      {isPlaying && currentCountry && (
        <div className={styles.journeyOverlay}>
          <div className={styles.journeyInfo}>
            <span
              className={styles.journeyDot}
              style={{ background: getSeasonColor(currentCountry.seasonId) }}
            />
            <span className={styles.journeyCountry}>{currentCountry.name}</span>
            <span className={styles.journeySeason} style={{ color: getSeasonColor(currentCountry.seasonId) }}>
              T{currentCountry.seasonId}
            </span>
            <span className={styles.journeyProgress}>
              {currentJourneyIndex + 1} / {journey.length}
            </span>
          </div>
          <div className={styles.journeyBar}>
            <div
              className={styles.journeyBarFill}
              style={{
                width: `${((currentJourneyIndex + 1) / journey.length) * 100}%`,
                background: getSeasonColor(currentCountry.seasonId),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
