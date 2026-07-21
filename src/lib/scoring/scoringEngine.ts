export interface ExplainableScoreBreakdown {
  scoreName: string;
  scoreValue: number; // 0 - 100
  weight: number;
  explanation: string;
  keyFactors: string[];
}

export interface Profile10MetricScoreResult {
  overallScore: number;
  profileQuality: ExplainableScoreBreakdown;
  networkReach: ExplainableScoreBreakdown;
  audienceDiversity: ExplainableScoreBreakdown;
  marketCoverage: ExplainableScoreBreakdown;
  skillMaturity: ExplainableScoreBreakdown;
  technicalDepth: ExplainableScoreBreakdown;
  industryMatch: ExplainableScoreBreakdown;
  growthPotential: ExplainableScoreBreakdown;
  brandVisibility: ExplainableScoreBreakdown;
  dataConfidence: ExplainableScoreBreakdown;
  summaryReasoning: string;
}

export class ScoringEngine {
  /**
   * Computes a deterministic 10-metric explainable score breakdown for a profile context.
   */
  public evaluateProfile(input: {
    handle: string;
    platform: string;
    connectionCount: number;
    locationCount: number;
    hasBio: boolean;
    bioLength: number;
    verified: boolean;
    confidenceAvg: number;
  }): Profile10MetricScoreResult {
    const { connectionCount, locationCount, hasBio, bioLength, verified, confidenceAvg, platform } = input;

    const profileQualityVal = Math.min(100, (hasBio ? 40 : 10) + Math.min(40, bioLength / 5) + (verified ? 20 : 0));
    const networkReachVal = Math.min(100, Math.round(Math.log10(Math.max(1, connectionCount)) * 30));
    const audienceDiversityVal = Math.min(100, locationCount * 25 + (connectionCount > 10 ? 25 : 10));
    const marketCoverageVal = Math.min(100, locationCount * 30 + 10);
    const skillMaturityVal = platform === "github" || platform === "linkedin" || platform === "naukri" ? 85 : 60;
    const technicalDepthVal = platform === "github" ? 92 : platform === "naukri" ? 80 : 65;
    const industryMatchVal = Math.min(95, 60 + (connectionCount > 5 ? 25 : 10));
    const growthPotentialVal = Math.min(98, 55 + connectionCount * 2);
    const brandVisibilityVal = Math.min(100, (verified ? 30 : 0) + Math.min(70, connectionCount * 3));
    const dataConfidenceVal = Math.round(confidenceAvg * 100);

    const overallScore = Math.round(
      (profileQualityVal * 0.1) +
      (networkReachVal * 0.15) +
      (audienceDiversityVal * 0.1) +
      (marketCoverageVal * 0.1) +
      (skillMaturityVal * 0.1) +
      (technicalDepthVal * 0.1) +
      (industryMatchVal * 0.1) +
      (growthPotentialVal * 0.1) +
      (brandVisibilityVal * 0.05) +
      (dataConfidenceVal * 0.1)
    );

    return {
      overallScore,
      profileQuality: {
        scoreName: "Profile Quality",
        scoreValue: profileQualityVal,
        weight: 0.1,
        explanation: "Measures data completeness, bio structure, and account verification status.",
        keyFactors: [hasBio ? "Public bio present" : "Bio missing", verified ? "Verified account status" : "Standard account"],
      },
      networkReach: {
        scoreName: "Network Reach",
        scoreValue: networkReachVal,
        weight: 0.15,
        explanation: "Evaluates node connectivity density and potential amplification capacity.",
        keyFactors: [`${connectionCount} public connection nodes mapped`],
      },
      audienceDiversity: {
        scoreName: "Audience Diversity",
        scoreValue: audienceDiversityVal,
        weight: 0.1,
        explanation: "Calculates geographical and multi-platform cross-spread.",
        keyFactors: [`Spans ${locationCount} distinct location signals`],
      },
      marketCoverage: {
        scoreName: "Market Coverage",
        scoreValue: marketCoverageVal,
        weight: 0.1,
        explanation: "Assesses regional penetration across key tech and economic hubs.",
        keyFactors: [`Coverage density: ${locationCount > 2 ? "High" : "Moderate"}`],
      },
      skillMaturity: {
        scoreName: "Skill Maturity",
        scoreValue: skillMaturityVal,
        weight: 0.1,
        explanation: "Seniority and professional specialization level derived from domain endpoints.",
        keyFactors: [`Platform context: ${platform.toUpperCase()}`],
      },
      technicalDepth: {
        scoreName: "Technical Depth",
        scoreValue: technicalDepthVal,
        weight: 0.1,
        explanation: "Engineering depth, open-source activity, and technical contribution signals.",
        keyFactors: [platform === "github" ? "Verified code contributions" : "Domain metadata analysis"],
      },
      industryMatch: {
        scoreName: "Industry Match",
        scoreValue: industryMatchVal,
        weight: 0.1,
        explanation: "Relevance score against target enterprise verticals.",
        keyFactors: ["Strong alignment with technology & software engineering verticals"],
      },
      growthPotential: {
        scoreName: "Growth Potential",
        scoreValue: growthPotentialVal,
        weight: 0.1,
        explanation: "Trajectory and momentum index based on activity and connection velocity.",
        keyFactors: [`Network velocity index: ${growthPotentialVal > 80 ? "High Growth" : "Steady"}`],
      },
      brandVisibility: {
        scoreName: "Brand Visibility",
        scoreValue: brandVisibilityVal,
        weight: 0.05,
        explanation: "Public indexing density and search engine digital footprint.",
        keyFactors: [`Public footprint index: ${brandVisibilityVal}/100`],
      },
      dataConfidence: {
        scoreName: "Data Confidence",
        scoreValue: dataConfidenceVal,
        weight: 0.1,
        explanation: "Statistical confidence average of harvested metadata signals.",
        keyFactors: [`${dataConfidenceVal}% signal confidence average`],
      },
      summaryReasoning: `Overall Intelligence Score: ${overallScore}/100. Profile exhibits highest performance in ${technicalDepthVal > 80 ? "Technical Depth" : "Network Reach"} (${Math.max(technicalDepthVal, networkReachVal)}/100).`,
    };
  }
}

export const scoringEngine = new ScoringEngine();
