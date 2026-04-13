import { useIsMobile } from './useMediaQuery';

export interface GlobeConfig {
  altitude: number;
  pointRadius: number;
  arcStroke: number;
  autoRotateSpeed: number;
  enableHtmlMarkers: boolean;
}

export function useGlobeConfig(): GlobeConfig {
  const isMobile = useIsMobile();

  if (isMobile) {
    return {
      altitude: 3.2,
      pointRadius: 0.55,
      arcStroke: 0.4,
      autoRotateSpeed: 0.3,
      enableHtmlMarkers: false,
    };
  }

  return {
    altitude: 2.5,
    pointRadius: 0.45,
    arcStroke: 0.3,
    autoRotateSpeed: 0.2,
    enableHtmlMarkers: true,
  };
}
