export type LocationType = "declared" | "geotag" | "inferred" | "organization" | "event";

export function getConfidenceScore(type: LocationType): number {
  switch (type) {
    case "declared":
      return 0.95;
    case "geotag":
      return 0.9;
    case "organization":
      return 0.75;
    case "event":
      return 0.6;
    case "inferred":
      return 0.4;
    default:
      return 0.2;
  }
}
