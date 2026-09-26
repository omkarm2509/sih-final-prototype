'use client';

import { useEffect, useRef } from 'react';
import { createSahyogSetuMarkerIcon, type MarkerKind } from '../lib/leafletMarker';

type Point = { lat: number; lng: number; label: string; kind?: string };

function markerKind(kind?: string): MarkerKind {
  switch (kind) {
    case 'request': return 'request';
    case 'available': return 'available';
    case 'busy': return 'busy';
    case 'completed': return 'completed';
    default: return 'default';
  }
}

export default function FederationMap({ points }: { points: Point[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: import('leaflet').Map | undefined;
    let mounted = true;

    (async () => {
      const L = await import('leaflet');
      if (!mounted || !ref.current) return;

      map = L.map(ref.current).setView([18.5204, 73.8567], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      points.forEach((p) => {
        L.marker([p.lat, p.lng], { icon: createSahyogSetuMarkerIcon(L, markerKind(p.kind)) })
          .addTo(map!)
          .bindPopup(`<b>${p.label}</b><br/>${(p.kind || 'location').toUpperCase()}<br/><small>Approximate demo location</small>`);
      });
    })();

    return () => {
      mounted = false;
      if (map) map.remove();
    };
  }, [points]);

  return <div ref={ref} className="h-[360px] w-full overflow-hidden rounded-2xl border" aria-label="Federation operational map" />;
}
