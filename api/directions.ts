import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

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

    // Return as [lng, lat] to match the existing RouteGeometry format
    points.push([lng / 1e5, lat / 1e5]);
  }

  return points;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { originLat, originLng, destLat, destLng } = req.query;

  if (!originLat || !originLng || !destLat || !destLng) {
    return res.status(400).json({ error: 'Missing origin/destination coordinates' });
  }

  try {
    const params = new URLSearchParams({
      origin: `${originLat},${originLng}`,
      destination: `${destLat},${destLng}`,
      mode: 'driving',
      key: GOOGLE_KEY,
    });

    const dirRes = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?${params}`
    );
    const dirData = await dirRes.json();

    if (dirData.status !== 'OK' || !dirData.routes?.length) {
      return res.status(200).json({ error: `Directions API returned: ${dirData.status}` });
    }

    const route = dirData.routes[0];
    const leg = route.legs[0];

    // Decode the overview polyline
    const coordinates = decodePolyline(route.overview_polyline.points);

    // Compute bounding box from coordinates
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
      duration: leg.duration.value,   // seconds
      distance: leg.distance.value,   // meters
    });
  } catch (err) {
    console.error('Directions error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
