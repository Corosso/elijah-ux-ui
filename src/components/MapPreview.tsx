import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteGeometry } from '../api/googleMaps';

interface MapPreviewProps {
  isDark: boolean;
  route?: RouteGeometry | null;
  origin?: { lat: number; lng: number } | null;
  destination?: { lat: number; lng: number } | null;
}

// Default: Medellín
const DEFAULT_CENTER: [number, number] = [6.2442, -75.5812];
const DEFAULT_ZOOM = 13;

export function MapPreview({ isDark, route, origin, destination }: MapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const [userCenter, setUserCenter] = useState<[number, number] | null>(null);
  const geoAttemptedRef = useRef(false);

  // Geolocation: try IP first, then browser
  useEffect(() => {
    if (geoAttemptedRef.current) return;
    geoAttemptedRef.current = true;

    // Attempt 1: IP-based geolocation
    fetch('https://ipapi.co/json/')
      .then((res) => {
        if (!res.ok) throw new Error('IP geolocation failed');
        return res.json();
      })
      .then((data) => {
        if (data.latitude && data.longitude) {
          setUserCenter([data.latitude, data.longitude]);
        } else {
          throw new Error('No coordinates in response');
        }
      })
      .catch(() => {
        // Attempt 2: Browser geolocation
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserCenter([position.coords.latitude, position.coords.longitude]);
            },
            () => {
              // Fallback: Medellín
              setUserCenter(DEFAULT_CENTER);
            },
            { timeout: 5000 }
          );
        } else {
          setUserCenter(DEFAULT_CENTER);
        }
      });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    const center = userCenter || DEFAULT_CENTER;
    const map = L.map(mapContainerRef.current, {
      center,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: false,
    });
    mapInstanceRef.current = map;
    routeLayerRef.current = L.layerGroup().addTo(map);
  }, [userCenter]);

  // Move map to user center once resolved
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCenter || route) return;
    map.setView(userCenter, DEFAULT_ZOOM);
  }, [userCenter, route]);

  // Update tiles on dark mode change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    tileLayerRef.current = L.tileLayer(tileUrl, { subdomains: 'abcd', maxZoom: 20 }).addTo(map);
  }, [isDark]);

  // Draw route when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = routeLayerRef.current;
    if (!map || !layerGroup) return;
    layerGroup.clearLayers();

    if (route && route.coordinates && origin && destination) {
      const latLngs: L.LatLngExpression[] = route.coordinates.map(([lng, lat]) => [lat, lng]);

      L.polyline(latLngs, {
        color: '#D4AF37',
        weight: 4,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);

      const originIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 16px; height: 16px; background-color: #10B981; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const destIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 16px; height: 16px; background-color: #D4AF37; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([origin.lat, origin.lng], { icon: originIcon }).addTo(layerGroup);
      L.marker([destination.lat, destination.lng], { icon: destIcon }).addTo(layerGroup);

      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { paddingTopLeft: [50, 50], paddingBottomRight: [400, 50] });
    }
  }, [route, origin, destination]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-0 rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />
    </div>
  );
}
