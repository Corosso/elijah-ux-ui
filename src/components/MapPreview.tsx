import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
interface MapPreviewProps {
  isDark: boolean;
}
export function MapPreview({ isDark }: MapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  useEffect(() => {
    if (!mapContainerRef.current) return;
    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [4.705, -74.051],
        zoom: 13,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false
      });
      mapInstanceRef.current = map;
      // Define route coordinates (approximate path from Parque 93 to El Dorado)
      const routeCoords: L.LatLngExpression[] = [
        [4.676, -74.048],
        [4.682, -74.055],
        [4.688, -74.065],
        [4.695, -74.085],
        [4.701, -74.11],
        [4.698, -74.135] // Destination (El Dorado area)
      ];
      // Add polyline
      L.polyline(routeCoords, {
        color: '#D4AF37',
        weight: 4,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      // Custom markers
      const originIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: 16px; height: 16px; background-color: #10B981; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      const destIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: 16px; height: 16px; background-color: #D4AF37; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker(routeCoords[0], {
        icon: originIcon
      }).addTo(map);
      L.marker(routeCoords[routeCoords.length - 1], {
        icon: destIcon
      }).addTo(map);
    }
    // Update tile layer based on dark mode
    const map = mapInstanceRef.current;
    if (map) {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      const tileUrl = isDark ?
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' :
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current = L.tileLayer(tileUrl, {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
    }
    // Cleanup on unmount
    return () => {



      // We don't destroy the map on every re-render, only when the component truly unmounts
      // However, React strict mode might cause issues if we destroy it here without careful handling.
      // For a simple decorative map, keeping the instance alive and just updating tiles is safer.
    };
  }, [isDark]); // Handle true unmount cleanup
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.8,
        delay: 0.6
      }}
      className="relative w-full h-full min-h-0 rounded-lg overflow-hidden z-10">

      <div
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0 z-0" />


      {/* Decorative Overlay Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-bg-surface-elevated/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-sm pointer-events-none">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Route Preview
        </span>
      </div>
    </motion.div>);

}