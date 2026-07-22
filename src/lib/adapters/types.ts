export type SourceProvider =
  | "github-api"
  | "reddit-api"
  | "web-scraper"
  | "mock-simulator"
  | "geo-service"
  | "unknown";

export type SocialAdapterResult = {
  platform: string;
  provider: SourceProvider; // Which adapter/provider generated this data
  profile: {
    url: string;
    handle?: string;
    name?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    followers?: number | null;
    following?: number | null;
    posts?: number | null;
    verified?: boolean | null;
  };
  connections: Array<{
    id: string;
    name: string;
    handle?: string;
    platform?: string;
    relationType: string; // follows, collaborated, same_company, etc.
    sourceUrl: string;
    confidence: number;
    location?: string;
    lat?: number;
    lng?: number;
    evidence?: string;
  }>;
  locations: Array<{
    label: string;
    city?: string;
    state?: string;
    country?: string;
    lat: number;
    lng: number;
    sourceUrl: string;
    confidence: number;
    type: "declared" | "geotag" | "inferred" | "organization" | "event";
    evidence?: string;
  }>;
  evidence: Array<{
    id: string;
    type: string; // API, scraper, metadata, text_nlp, inference
    sourceUrl: string;
    snippet?: string;
    confidence: number;
  }>;
};

export interface ISocialAdapter {
  platform: string;
  provider: SourceProvider;
  supports(url: string): boolean;
  analyze(url: string): Promise<SocialAdapterResult>;
}
