interface GeoLocation {
  lat: number;
  lng: number;
}

const BOGOTA_DEFAULT: GeoLocation = { lat: 4.705, lng: -74.051 };

export async function getUserLocation(): Promise<GeoLocation> {
  // Step 1: Try IP-based geolocation (no permission needed)
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return { lat: data.latitude, lng: data.longitude };
      }
    }
  } catch {
    // IP geolocation failed, try browser API
  }

  // Step 2: Try browser Geolocation API (asks permission)
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 8000,
        maximumAge: 300000,
      });
    });
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  } catch {
    // Browser geolocation failed
  }

  // Step 3: Default to Bogota
  return BOGOTA_DEFAULT;
}
