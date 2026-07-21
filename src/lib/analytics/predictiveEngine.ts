export interface PredictiveAnalyticsResult {
  predictedAudienceGrowth30d: string;
  recommendedExpansionHubs: string[];
  hiringDemandIndex: "High" | "Moderate" | "Steady";
  engagementVelocityScore: number; // 0 - 100
  marketOpportunitySummary: string;
}

export class PredictiveEngine {
  public predictProfileGrowth(input: {
    connectionCount: number;
    topLocations: string[];
    platform: string;
  }): PredictiveAnalyticsResult {
    const { connectionCount, topLocations, platform } = input;

    const velocity = Math.min(95, 60 + connectionCount * 1.5 + topLocations.length * 5);
    const growthEst = `+${Math.round(connectionCount * 0.15 + 12)}% projected growth`;

    const expansionHubs = topLocations.length > 0
      ? topLocations.slice(0, 3)
      : ["London, UK", "San Francisco, CA", "Bengaluru, India"];

    return {
      predictedAudienceGrowth30d: growthEst,
      recommendedExpansionHubs: expansionHubs,
      hiringDemandIndex: platform === "github" || platform === "linkedin" || platform === "naukri" ? "High" : "Moderate",
      engagementVelocityScore: velocity,
      marketOpportunitySummary: `Predictive Engine projects high audience velocity (${velocity}/100) with key expansion opportunities in ${expansionHubs.join(", ")}.`,
    };
  }
}

export const predictiveEngine = new PredictiveEngine();
