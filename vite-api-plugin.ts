/**
 * Vite plugin that handles /api/* routes locally for development.
 * Uses Google Places API (New) and Directions API.
 */
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(process.cwd(), '.env') });

function getGoogleKey(): string {
  return process.env.GOOGLE_MAPS_API_KEY || '';
}

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

/** Send a JSON response */
function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

async function handlePlacesAutocomplete(query: Record<string, string>, res: ServerResponse) {
  const GOOGLE_KEY = getGoogleKey();
  const { input, lat, lng } = query;

  if (!input || input.length < 3) {
    return sendJson(res, 200, { suggestions: [] });
  }

  try {
    // 1. Places Autocomplete (New API)
    const body: Record<string, unknown> = {
      input,
      includedRegionCodes: ['co'],
      languageCode: 'es',
    };

    if (lat && lng) {
      body.locationBias = {
        circle: {
          center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
          radius: 50000.0,
        },
      };
    }

    const acRes = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_KEY,
      },
      body: JSON.stringify(body),
    });
    const acData = await acRes.json();

    const predictions = acData.suggestions?.filter((s: any) => s.placePrediction) ?? [];

    if (predictions.length === 0) {
      return sendJson(res, 200, { suggestions: [], _debug: { raw: acData } });
    }

    // 2. Resolve placeId → lat/lng via Place Details (New API)
    const suggestions = await Promise.all(
      predictions.slice(0, 5).map(async (s: any) => {
        const pred = s.placePrediction;
        try {
          const detailRes = await fetch(
            `https://places.googleapis.com/v1/places/${pred.placeId}`,
            {
              headers: {
                'X-Goog-Api-Key': GOOGLE_KEY,
                'X-Goog-FieldMask': 'location',
              },
            }
          );
          const detailData = await detailRes.json();
          if (detailData.location) {
            return {
              label: pred.text?.text || pred.structuredFormat?.mainText?.text || '',
              lat: detailData.location.latitude,
              lng: detailData.location.longitude,
            };
          }
        } catch {
          // skip failed detail lookups
        }
        return null;
      })
    );

    sendJson(res, 200, { suggestions: suggestions.filter(Boolean) });
  } catch (err: any) {
    console.error('[api] places-autocomplete error:', err);
    sendJson(res, 500, { error: err.message });
  }
}

async function handleDirections(query: Record<string, string>, res: ServerResponse) {
  const GOOGLE_KEY = getGoogleKey();
  const { originLat, originLng, destLat, destLng } = query;

  if (!originLat || !originLng || !destLat || !destLng) {
    return sendJson(res, 400, { error: 'Missing origin/destination coordinates' });
  }

  try {
    const dirRes = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=driving&key=${GOOGLE_KEY}`
    );
    const dirData = await dirRes.json();

    if (dirData.status !== 'OK' || !dirData.routes?.length) {
      return sendJson(res, 200, { error: `Directions API: ${dirData.status}` });
    }

    const route = dirData.routes[0];
    const leg = route.legs[0];
    const coordinates = decodePolyline(route.overview_polyline.points);

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const [ln, lt] of coordinates) {
      if (ln < minLng) minLng = ln;
      if (lt < minLat) minLat = lt;
      if (ln > maxLng) maxLng = ln;
      if (lt > maxLat) maxLat = lt;
    }

    sendJson(res, 200, {
      coordinates,
      bbox: [minLng, minLat, maxLng, maxLat],
      duration: leg.duration.value,
      distance: leg.distance.value,
    });
  } catch (err: any) {
    console.error('[api] directions error:', err);
    sendJson(res, 500, { error: err.message });
  }
}

export function vercelApiPlugin(): Plugin {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: Function) => {
        if (!req.url?.startsWith('/api/')) return next();

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;
        const query: Record<string, string> = {};
        parsedUrl.searchParams.forEach((value, key) => {
          query[key] = value;
        });

        if (pathname === '/api/places-autocomplete') {
          await handlePlacesAutocomplete(query, res);
        } else if (pathname === '/api/directions') {
          await handleDirections(query, res);
        } else {
          sendJson(res, 404, { error: 'API route not found' });
        }
      });
    },
  };
}
