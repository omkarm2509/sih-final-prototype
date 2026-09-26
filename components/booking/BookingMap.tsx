'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { createSahyogSetuMarkerIcon } from '../../lib/leafletMarker';

export default function BookingMap({ coords }: { coords?: { lat: number; lng: number } }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const center: [number, number] = coords ? [coords.lat, coords.lng] : [18.5204, 73.8567];
    const map = L.map(ref.current, { scrollWheelZoom: false }).setView(center, coords ? 15 : 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    markerRef.current = L.marker(center, { icon: createSahyogSetuMarkerIcon(L, 'request') }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && coords) {
      const p: [number, number] = [coords.lat, coords.lng];
      mapRef.current.setView(p, 15);
      markerRef.current?.setLatLng(p);
    }
  }, [coords]);

  return <div ref={ref} className="h-64 w-full overflow-hidden rounded-2xl border border-slate-200 sm:h-72" aria-label="OpenStreetMap service location map" />;
}
