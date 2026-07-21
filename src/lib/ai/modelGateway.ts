import { logger } from "../logger";

export interface ModelGatewayRequest {
  promptId: string;
  payload: Record<string, unknown>;
  complexity: "low" | "medium" | "high";
}

export interface ModelGatewayResponse {
  result: Record<string, unknown>;
  cached: boolean;
  modelUsed: string;
  tokenCostEstimate: number;
  latencyMs: number;
}

export class ModelGateway {
  private cache = new Map<string, { response: Record<string, unknown>; timestamp: number }>();
  private readonly CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes cache

  public async routeAndExecute(request: ModelGatewayRequest): Promise<ModelGatewayResponse> {
    const startTime = Date.now();
    const cacheKey = `${request.promptId}:${JSON.stringify(request.payload)}`;

    // 1. Check cache to optimize AI costs
    if (this.cache.has(cacheKey)) {
      const cachedItem = this.cache.get(cacheKey)!;
      if (Date.now() - cachedItem.timestamp < this.CACHE_TTL_MS) {
        logger.info("ModelGateway: Serving cached AI response", { promptId: request.promptId });
        return {
          result: cachedItem.response,
          cached: true,
          modelUsed: "cache-layer",
          tokenCostEstimate: 0,
          latencyMs: Date.now() - startTime,
        };
      }
    }

    // 2. Route request to appropriate model tier based on complexity
    let modelUsed = "gemini-1.5-flash-fast";
    let cost = 0.0001;

    if (request.complexity === "high") {
      modelUsed = "gemini-1.5-pro-deep";
      cost = 0.0025;
    } else if (request.complexity === "medium") {
      modelUsed = "gemini-1.5-flash";
      cost = 0.0005;
    }

    // Simulate model execution result
    const simulatedResult = {
      status: "success",
      routedModel: modelUsed,
      processedPayload: request.payload,
    };

    // Save to cache
    this.cache.set(cacheKey, { response: simulatedResult, timestamp: Date.now() });

    return {
      result: simulatedResult,
      cached: false,
      modelUsed,
      tokenCostEstimate: cost,
      latencyMs: Date.now() - startTime,
    };
  }
}

export const modelGateway = new ModelGateway();
