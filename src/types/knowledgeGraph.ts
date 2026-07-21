export type KnowledgeGraphNodeType =
  | "Person"
  | "Company"
  | "Skill"
  | "Location"
  | "Project"
  | "Industry"
  | "Community";

export type KnowledgeGraphEdgeType =
  | "EMPLOYED_BY"
  | "EDUCATED_AT"
  | "SKILLED_IN"
  | "LOCATED_IN"
  | "COLLABORATED_WITH"
  | "CONTRIBUTED_TO"
  | "AFFILIATED_WITH";

export interface KnowledgeGraphNode {
  id: string;
  type: KnowledgeGraphNodeType;
  label: string;
  properties: Record<string, unknown>;
  confidence: number;
}

export interface KnowledgeGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: KnowledgeGraphEdgeType;
  weight: number;
  evidence: string;
}

export interface KnowledgeGraphGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  metadata: {
    totalEntities: number;
    densityScore: number;
    lastUpdated: string;
  };
}
