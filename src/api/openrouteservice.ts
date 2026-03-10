const ORS_BASE = 'https://api.openrouteservice.org';
const ORS_KEY = import.meta.env.VITE_ORS_API_KEY;

export interface GeocodeSuggestion {
  label: string;
  lat: number;
  lng: number;
}

export interface RouteGeometry {
  coordinates: [number, number][]; // [lng, lat] pairs
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  duration: number; // seconds
  distance: number; // meters
}

export async function geocodeAutocomplete(
  text: string,
  focus?: { lat: number; lng: number }
): Promise<GeocodeSuggestion[]> {
  if (!text || text.length < 3) return [];

  const params = new URLSearchParams({
    api_key: ORS_KEY,
    text,
    'boundary.country': 'CO',
    size: '5',
  });

  if (focus) {
    params.set('focus.point.lat', String(focus.lat));
    params.set('focus.point.lon', String(focus.lng));
  }

  const res = await fetch(`${ORS_BASE}/geocode/autocomplete?${params}`);
  if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);

  const data = await res.json();
  return (data.features || []).map((f: any) => ({
    label: f.properties.label,
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
  }));
}

export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteGeometry> {
  const res = await fetch(`${ORS_BASE}/v2/directions/driving-car/geojson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: ORS_KEY,
    },
    body: JSON.stringify({
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
    }),
  });

  if (!res.ok) throw new Error(`Directions failed: ${res.status}`);

  const data = await res.json();
  const feature = data.features[0];
  const coords: [number, number][] = feature.geometry.coordinates;

  return {
    coordinates: coords,
    bbox: data.bbox,
    duration: feature.properties.summary.duration,
    distance: feature.properties.summary.distance,
  };
}
