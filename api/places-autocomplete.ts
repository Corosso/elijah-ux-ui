import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, lat, lng } = req.query;

  if (!input || typeof input !== 'string' || input.length < 3) {
    return res.status(200).json({ suggestions: [] });
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
          center: { latitude: parseFloat(String(lat)), longitude: parseFloat(String(lng)) },
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
      return res.status(200).json({ suggestions: [] });
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
              label: pred.text?.text || '',
              lat: detailData.location.latitude,
              lng: detailData.location.longitude,
            };
          }
        } catch {
          // skip failed lookups
        }
        return null;
      })
    );

    return res.status(200).json({
      suggestions: suggestions.filter(Boolean),
    });
  } catch (err) {
    console.error('Places autocomplete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
