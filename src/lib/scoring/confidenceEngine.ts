export interface AttributionSource {
  sourceName: string;
  sourceUrl: string;
  dataType: "declared" | "inferred" | "api_endpoint";
  confidenceScore: number; // 0 - 1
  freshnessTimestamp: string;
}

export interface ConfidenceEngineResult {
  confidenceScore: number; // 0 - 100
  confidenceLevel: "High" | "Moderate" | "Low";
  dataFreshness: string;
  sourceAttributions: AttributionSource[];
  reasoningSummary: string;
  missingInformation: string[];
}

export class ConfidenceEngine {
  public evaluateConfidence(input: {
    sources: AttributionSource[];
    profileFieldCount: number;
    hasGeoData: boolean;
  }): ConfidenceEngineResult {
    const { sources, profileFieldCount, hasGeoData } = input;

    const avgSourceConf = sources.length > 0
      ? sources.reduce((acc, s) => acc + s.confidenceScore, 0) / sources.length
      : 0.85;

    const baseScore = Math.round(avgSourceConf * 70 + Math.min(30, profileFieldCount * 5));
    const confidenceScore = Math.min(99, Math.max(50, baseScore));

    const missingInfo: string[] = [];
    if (!hasGeoData) missingInfo.push("Explicit primary location field undeclared on landing profile.");
    if (sources.length < 2) missingInfo.push("Cross-platform verification pending secondary data connectors.");

    return {
      confidenceScore,
      confidenceLevel: confidenceScore >= 85 ? "High" : confidenceScore >= 70 ? "Moderate" : "Low",
      dataFreshness: new Date().toISOString(),
      sourceAttributions: sources,
      reasoningSummary: `Harvested ${sources.length} public endpoint signals with a statistical confidence average of ${confidenceScore}%.`,
      missingInformation: missingInfo,
    };
  }
}

export const confidenceEngine = new ConfidenceEngine();
