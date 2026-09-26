import type * as Leaflet from 'leaflet';

export type MarkerKind = 'request' | 'available' | 'busy' | 'completed' | 'default';

const markerFiles: Record<MarkerKind, string> = {
  request: '/assets/leaflet/request-marker.svg',
  available: '/assets/leaflet/available-marker.svg',
  busy: '/assets/leaflet/busy-marker.svg',
  completed: '/assets/leaflet/completed-marker.svg',
  default: '/assets/leaflet/default-marker.svg',
};

export function createSahyogSetuMarkerIcon(L: typeof Leaflet, kind: MarkerKind = 'default') {
  return L.icon({
    iconUrl: markerFiles[kind] ?? markerFiles.default,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
}
