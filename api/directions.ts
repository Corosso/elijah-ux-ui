import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Decode a Google encoded polyline string into [lng, lat] pairs */
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lng / 1e5, lat / 1e5]);
  }

  return points;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { originLat, originLng, destLat, destLng } = req.query;

  if (!originLat || !originLng || !destLat || !destLng) {
    return res.status(400).json({ error: 'Missing origin/destination coordinates' });
  }

  try {
    const routeRes = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: parseFloat(String(originLat)), longitude: parseFloat(String(originLng)) } } },
        destination: { location: { latLng: { latitude: parseFloat(String(destLat)), longitude: parseFloat(String(destLng)) } } },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        units: 'METRIC',
      }),
    });
    const routeData = await routeRes.json();

    if (!routeData.routes?.length) {
      return res.status(200).json({ error: 'Routes API: no routes found' });
    }

    const route = routeData.routes[0];
    const coordinates = decodePolyline(route.polyline.encodedPolyline);
    const durationSeconds = parseInt(route.duration.replace('s', ''), 10);
    const distanceMeters = route.distanceMeters;

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const [ln, lt] of coordinates) {
      if (ln < minLng) minLng = ln;
      if (lt < minLat) minLat = lt;
      if (ln > maxLng) maxLng = ln;
      if (lt > maxLat) maxLat = lt;
    }

    return res.status(200).json({
      coordinates,
      bbox: [minLng, minLat, maxLng, maxLat],
      duration: durationSeconds,
      distance: distanceMeters,
    });
  } catch (err) {
    console.error('Directions error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
