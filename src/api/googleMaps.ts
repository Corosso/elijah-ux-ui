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

  const params = new URLSearchParams({ input: text });

  if (focus) {
    params.set('lat', String(focus.lat));
    params.set('lng', String(focus.lng));
  }

  const res = await fetch(`/api/places-autocomplete?${params}`);
  if (!res.ok) throw new Error(`Autocomplete failed: ${res.status}`);

  const data = await res.json();
  return data.suggestions || [];
}

export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteGeometry> {
  const params = new URLSearchParams({
    originLat: String(origin.lat),
    originLng: String(origin.lng),
    destLat: String(destination.lat),
    destLng: String(destination.lng),
  });

  const res = await fetch(`/api/directions?${params}`);
  if (!res.ok) throw new Error(`Directions failed: ${res.status}`);

  const data = await res.json();

  if (data.error) throw new Error(data.error);

  return {
    coordinates: data.coordinates,
    bbox: data.bbox,
    duration: data.duration,
    distance: data.distance,
  };
}
