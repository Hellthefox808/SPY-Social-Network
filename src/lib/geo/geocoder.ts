import { geoService, GeocodeResult } from "../services/GeoService";

export async function geocode(locationText: string): Promise<GeocodeResult> {
  return geoService.geocode(locationText);
}
