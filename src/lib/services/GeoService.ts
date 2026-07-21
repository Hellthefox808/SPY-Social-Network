import { fetchWithRetry } from "../utils/fetchWithRetry";
import { logger } from "../logger";

const TECH_HUBS_DICTIONARY: Record<
  string,
  { lat: number; lng: number; city: string; state?: string; country: string }
> = {
  "san francisco": { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "California", country: "United States" },
  "sf": { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "California", country: "United States" },
  "bay area": { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "California", country: "United States" },
  "new york": { lat: 40.7128, lng: -74.006, city: "New York", state: "New York", country: "United States" },
  "nyc": { lat: 40.7128, lng: -74.006, city: "New York", state: "New York", country: "United States" },
  "london": { lat: 51.5074, lng: -0.1278, city: "London", country: "United Kingdom" },
  "uk": { lat: 51.5074, lng: -0.1278, city: "London", country: "United Kingdom" },
  "tokyo": { lat: 35.6762, lng: 139.6503, city: "Tokyo", country: "Japan" },
  "seattle": { lat: 47.6062, lng: -122.3321, city: "Seattle", state: "Washington", country: "United States" },
  "austin": { lat: 30.2672, lng: -97.7431, city: "Austin", state: "Texas", country: "United States" },
  "berlin": { lat: 52.52, lng: 13.405, city: "Berlin", country: "Germany" },
  "paris": { lat: 48.8566, lng: 2.3522, city: "Paris", country: "France" },
  "bangalore": { lat: 12.9716, lng: 77.5946, city: "Bengaluru", state: "Karnataka", country: "India" },
  "bengaluru": { lat: 12.9716, lng: 77.5946, city: "Bengaluru", state: "Karnataka", country: "India" },
  "toronto": { lat: 43.6532, lng: -79.3832, city: "Toronto", state: "Ontario", country: "Canada" },
  "sydney": { lat: -33.8688, lng: 151.2093, city: "Sydney", state: "New South Wales", country: "Australia" },
  "helsinki": { lat: 60.1699, lng: 24.9384, city: "Helsinki", country: "Finland" },
  "portland": { lat: 45.5152, lng: -122.6784, city: "Portland", state: "Oregon", country: "United States" },
  "boston": { lat: 42.3601, lng: -71.0589, city: "Boston", state: "Massachusetts", country: "United States" },
  "chicago": { lat: 41.8781, lng: -87.6298, city: "Chicago", state: "Illinois", country: "United States" },
  "denver": { lat: 39.7392, lng: -104.9903, city: "Denver", state: "Colorado", country: "United States" },
  "munich": { lat: 48.1351, lng: 11.582, city: "Munich", state: "Bavaria", country: "Germany" },
  "amsterdam": { lat: 52.3676, lng: 4.9041, city: "Amsterdam", country: "Netherlands" },
  "singapore": { lat: 1.3521, lng: 103.8198, city: "Singapore", country: "Singapore" },
  "dublin": { lat: 53.3498, lng: -6.2603, city: "Dublin", country: "Ireland" },
  "stockholm": { lat: 59.3293, lng: 18.0686, city: "Stockholm", country: "Sweden" },
};

export interface GeocodeResult {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  country?: string;
}

export class GeoService {
  private cache = new Map<string, GeocodeResult>();

  public async geocode(locationText: string, correlationId?: string): Promise<GeocodeResult> {
    if (!locationText || locationText.trim() === "") {
      return { lat: 0, lng: 0 };
    }

    const cleanText = locationText.toLowerCase().trim();

    // 1. Check memory cache
    if (this.cache.has(cleanText)) {
      return this.cache.get(cleanText)!;
    }

    // 2. Check Tech Hubs dictionary
    for (const [key, val] of Object.entries(TECH_HUBS_DICTIONARY)) {
      if (cleanText.includes(key)) {
        this.cache.set(cleanText, val);
        return val;
      }
    }

let nominatimPromise: Promise<void> = Promise.resolve();

    // 3. Query OpenStreetMap Nominatim API
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        locationText
      )}&format=json&limit=1`;

      // Enforce 1.1s delay between concurrent requests to respect Nominatim limits
      const currentPromise = nominatimPromise;
      nominatimPromise = (async () => {
        await currentPromise;
        await new Promise((resolve) => setTimeout(resolve, 1100));
      })();
      await currentPromise;

      const res = await fetchWithRetry(url, {
        headers: {
          "User-Agent": "SocialGraph-Atlas-App/1.0",
        },
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const item = data[0];
          const displayNameParts = item.display_name.split(",").map((s: string) => s.trim());
          const result: GeocodeResult = {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            city: displayNameParts[0] || undefined,
            country: displayNameParts[displayNameParts.length - 1] || undefined,
          };
          this.cache.set(cleanText, result);
          return result;
        }
      }
    } catch (err) {
      logger.warn(`OSM Geocoding fallback for "${locationText}"`, {}, correlationId, err);
    }

    const fallback: GeocodeResult = {
      lat: 0,
      lng: 0,
      city: locationText.split(",")[0]?.trim() || undefined,
      country: undefined,
    };
    this.cache.set(cleanText, fallback);
    return fallback;
  }
}

export const geoService = new GeoService();
