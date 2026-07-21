import { logger } from "../logger";

export interface AgentTaskContext {
  profileHandle: string;
  platform: string;
  locations: string[];
  connections: Array<{ name: string; relationType: string }>;
  bioText: string;
}

export class GeoAgent {
  public analyzeGeo(locations: string[]) {
    const primary = locations[0] || "Global / Remote";
    const clusters = locations.length;
    return {
      primaryHub: primary,
      clustersCount: clusters,
      geoRecommendation: clusters > 1
        ? `Multi-cluster audience detected across ${clusters} hubs. Priority hub: ${primary}.`
        : `Single geographic footprint concentrated in ${primary}.`,
    };
  }
}

export class MarketingAgent {
  public analyzeGrowth(connectionCount: number, platform: string) {
    const amplificationFactor = connectionCount > 500 ? "High Tier (500+ Reach)" : "Standard Tier";
    return {
      amplificationFactor,
      marketingChannel: platform === "github" ? "Developer Relations & Open Source" : "B2B LinkedIn & Targeted Campaigns",
      campaignAction: `Focus marketing push on ${platform.toUpperCase()} network channels to leverage high engagement nodes.`,
    };
  }
}

export class RecruitmentAgent {
  public analyzeTalentFit(platform: string, bioText: string) {
    const isTech = bioText.toLowerCase().includes("engineer") || bioText.toLowerCase().includes("developer") || platform === "github";
    return {
      talentCategory: isTech ? "Software Engineering & Cloud Architecture" : "General Business / Management",
      recruitingRecommendation: isTech ? "High priority candidate for technical & engineering roles." : "Recommended candidate for strategy & business development roles.",
    };
  }
}

export class AuditAgent {
  public redactPII(bioText: string) {
    // Redacts email addresses and phone numbers for compliance
    const sanitizedBio = bioText
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED EMAIL]")
      .replace(/\+?\d[\d -]{8,}\d/g, "[REDACTED PHONE]");
    return {
      sanitizedBio,
      privacyCompliant: true,
    };
  }
}

export class MultiAgentOrchestrator {
  private geoAgent = new GeoAgent();
  private marketingAgent = new MarketingAgent();
  private recruitmentAgent = new RecruitmentAgent();
  private auditAgent = new AuditAgent();

  public orchestrate(context: AgentTaskContext) {
    logger.info("Orchestrating Multi-Agent Pipeline", { handle: context.profileHandle });

    const auditRes = this.auditAgent.redactPII(context.bioText);
    const geoRes = this.geoAgent.analyzeGeo(context.locations);
    const mktRes = this.marketingAgent.analyzeGrowth(context.connections.length, context.platform);
    const hrRes = this.recruitmentAgent.analyzeTalentFit(context.platform, auditRes.sanitizedBio);

    return {
      audit: auditRes,
      geo: geoRes,
      marketing: mktRes,
      recruitment: hrRes,
      executionTimestamp: new Date().toISOString(),
    };
  }
}

export const multiAgentOrchestrator = new MultiAgentOrchestrator();
