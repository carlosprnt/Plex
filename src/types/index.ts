export interface Guest {
  name: string;
  role: string;
  wikipediaUrl?: string;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Country {
  id: string;
  name: string;
  lat: number;
  lng: number;
  seasonId: number;
  orderInSeason: number;
  description?: string;
  videoUrl?: string;
  guests: Guest[];
}

export interface Season {
  id: number;
  title: string;
  subtitle: string;
  year: number;
  totalDays: number;
  color: string;
  glowColor: string;
  status: 'completed' | 'ongoing';
  countries: Country[];
}

export type ViewMode = 'globe' | 'list';
