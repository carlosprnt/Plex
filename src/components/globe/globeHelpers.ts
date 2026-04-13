import type { Country } from '../../types';
import { getSeasonColor } from '../../data/worldTourData';

export interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  seasonId: number;
}

export interface PointData {
  lat: number;
  lng: number;
  color: string;
  seasonId: number;
  country: Country;
  size: number;
}

export function buildPointsData(countries: Country[]): PointData[] {
  return countries.map((c) => ({
    lat: c.lat,
    lng: c.lng,
    color: getSeasonColor(c.seasonId),
    seasonId: c.seasonId,
    country: c,
    size: c.guests.length > 0 ? 0.7 : 0.45,
  }));
}

export function buildArcsData(countries: Country[]): ArcData[] {
  const bySeason = new Map<number, Country[]>();
  for (const c of countries) {
    const list = bySeason.get(c.seasonId) ?? [];
    list.push(c);
    bySeason.set(c.seasonId, list);
  }

  const arcs: ArcData[] = [];
  for (const [seasonId, list] of bySeason) {
    const sorted = [...list].sort((a, b) => a.orderInSeason - b.orderInSeason);
    const color = getSeasonColor(seasonId);
    for (let i = 0; i < sorted.length - 1; i++) {
      arcs.push({
        startLat: sorted[i].lat,
        startLng: sorted[i].lng,
        endLat: sorted[i + 1].lat,
        endLng: sorted[i + 1].lng,
        color,
        seasonId,
      });
    }
  }

  return arcs;
}
