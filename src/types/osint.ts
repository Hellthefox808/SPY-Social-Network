export interface JobProfile {
  id: string;
  jobId: string;
  platform: string;
  handle?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  website?: string | null;
  followersCount?: number | null;
  followingCount?: number | null;
  postsCount?: number | null;
  locationText?: string | null;
  sourceUrl: string;
}

export interface JobEntity {
  id: string;
  jobId: string;
  entityType: string;
  name: string;
  platform?: string | null;
  externalUrl?: string | null;
  confidence: number;
}

export interface JobLocation {
  id: string;
  entityId?: string | null;
  jobId: string;
  label: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  lat: number;
  lng: number;
  locationType: string;
  confidence: number;
  sourceUrl: string;
  evidenceText?: string | null;
}

export interface JobEdge {
  id: string;
  jobId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: string;
  weight: number;
  confidence: number;
  sourceUrl?: string | null;
  evidenceText?: string | null;
  target?: {
    name: string;
  };
}

export interface JobEvidenceItem {
  id: string;
  jobId: string;
  entityId?: string | null;
  edgeId?: string | null;
  locationId?: string | null;
  evidenceType: string;
  sourceUrl: string;
  snippet?: string | null;
  extractionMethod: string;
  confidence: number;
  createdAt: Date | string;
}

export interface AnalysisJobData {
  id: string;
  inputUrl: string;
  normalizedUrl: string;
  detectedPlatform: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  createdAt: Date | string;
  completedAt?: Date | string | null;
  errorMessage?: string | null;
  profiles: JobProfile[];
  entities: JobEntity[];
  locations: JobLocation[];
  edges: JobEdge[];
  evidenceItems: JobEvidenceItem[];
}
