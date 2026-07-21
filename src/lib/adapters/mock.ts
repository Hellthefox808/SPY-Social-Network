import { ISocialAdapter, SocialAdapterResult } from "./types";

export class MockSocialAdapter implements ISocialAdapter {
  platform: string;

  constructor(platform: string) {
    this.platform = platform;
  }

  supports(url: string): boolean {
    return url.toLowerCase().includes(this.platform);
  }

  async analyze(url: string): Promise<SocialAdapterResult> {
    const handle = this.extractHandle(url) || "explorer";
    const displayName = handle.charAt(0).toUpperCase() + handle.slice(1).replace(/_/g, " ");

    const locationsPool = [
      { label: "London, UK", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
      { label: "San Francisco, CA", city: "San Francisco", state: "California", country: "United States", lat: 37.7749, lng: -122.4194 },
      { label: "New York, NY", city: "New York", state: "New York", country: "United States", lat: 40.7128, lng: -74.006 },
      { label: "Tokyo, Japan", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
      { label: "Sydney, Australia", city: "Sydney", state: "New South Wales", country: "Australia", lat: -33.8688, lng: 151.2093 },
    ];

    const locIdx = handle.length % locationsPool.length;
    const selectedLoc = locationsPool[locIdx];

    // Dynamically assign an image avatar using Unsplash source ids to guarantee a nice visual header
    const profile = {
      url,
      handle,
      name: displayName,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop`,
      bio: this.generateBio(handle),
      location: selectedLoc.label,
      website: `https://${handle}.io`,
      followers: 12500 * (handle.length + 1),
      following: 450 + handle.length * 5,
      posts: 80 + handle.length,
      verified: handle.length > 5,
    };

    const connections = [
      {
        id: `entity-${this.platform}-${handle}-collab1`,
        name: `alex_adventures`,
        platform: this.platform,
        relationType: "collaborated",
        sourceUrl: url,
        confidence: 0.85,
        location: "Denver, CO",
        lat: 39.7392,
        lng: -104.9903,
        evidence: `Directly tagged in photo/post captions: "@alex_adventures #collab"`,
      },
      {
        id: `entity-${this.platform}-${handle}-collab2`,
        name: "TechCorp HQ",
        platform: "linkedin",
        relationType: "same_company",
        sourceUrl: url,
        confidence: 0.75,
        location: "Seattle, WA",
        lat: 47.6062,
        lng: -122.3321,
        evidence: `Profile metadata matches: "Staff Engineer at TechCorp"`,
      },
    ];

    if (this.platform === "linkedin") {
      connections.push({
        id: `entity-${this.platform}-${handle}-school`,
        name: "Stanford University",
        platform: "linkedin",
        relationType: "same_school",
        sourceUrl: url,
        confidence: 0.9,
        location: "Stanford, CA",
        lat: 37.4275,
        lng: -122.1697,
        evidence: `Education history displays: "Stanford University (M.S. Computer Science)"`,
      });
    }

    const locations = [
      {
        label: selectedLoc.label,
        city: selectedLoc.city,
        state: selectedLoc.state,
        country: selectedLoc.country,
        lat: selectedLoc.lat,
        lng: selectedLoc.lng,
        sourceUrl: url,
        confidence: 0.95,
        type: "declared" as const,
        evidence: `Profile location field explicitly set to "${selectedLoc.label}"`,
      },
      {
        label: `${connections[0].location} (Collaborator)`,
        lat: connections[0].lat,
        lng: connections[0].lng,
        sourceUrl: url,
        confidence: 0.6,
        type: "inferred" as const,
        evidence: `Inferred location from co-mentions with "${connections[0].name}"`,
      },
    ];

    const evidence = [
      {
        id: `ev-mock-scraped-${handle}`,
        type: "scraper",
        sourceUrl: url,
        snippet: `Scraped public profile header. Detected name: "${displayName}", Location: "${selectedLoc.label}", Website: "https://${handle}.io".`,
        confidence: 0.85,
      },
      {
        id: `ev-mock-infer-${handle}`,
        type: "inference",
        sourceUrl: url,
        snippet: `Detected repeated visual tagging and hashtags involving @alex_adventures in post logs.`,
        confidence: 0.75,
      },
    ];

    return {
      platform: this.platform,
      profile,
      connections,
      locations,
      evidence,
    };
  }

  private extractHandle(url: string): string | null {
    try {
      const parsed = new URL(url);
      const paths = parsed.pathname.split("/").filter(Boolean);
      return paths[0] || null;
    } catch {
      return null;
    }
  }

  private generateBio(handle: string): string {
    switch (this.platform) {
      case "instagram":
        return `📸 Visual storyteller & explorer. 🗺️ documenting places and tech. ✨ collab/business: hello@${handle}.io`;
      case "x":
        return `Building things in public. Mostly talking about AI, web architecture, and design. Views are my own.`;
      case "linkedin":
        return `Senior Systems Architect | Developing distributed databases & mapping graph structures. Former Stanford CS.`;
      case "youtube":
        return `Weekly tutorials on web development, interactive maps, and design systems. Subscribe for new videos!`;
      case "tiktok":
        return `Quick coding tips and tech humor. 💻 Join 100k+ learners. Link in bio!`;
      default:
        return `Public profile for ${handle} on ${this.platform}. Discovering relationships and geo-tags.`;
    }
  }
}
