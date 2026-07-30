import { describe, it } from 'node:test';
import assert from 'node:assert';
import { checkRateLimit } from '../src/lib/rateLimiter';
import { confidenceEngine } from '../src/lib/scoring/confidenceEngine';

describe('Production Readiness Unit Test Suite', () => {
  describe('Rate Limiter Service', () => {
    it('should allow requests within limit and block when exceeded', () => {
      const clientIp = '127.0.0.1';
      const limit = 5;
      const windowMs = 60000;

      for (let i = 0; i < limit; i++) {
        const result = checkRateLimit(clientIp, limit, windowMs);
        assert.strictEqual(result.allowed, true, `Request ${i + 1} should be allowed`);
      }

      const exceededResult = checkRateLimit(clientIp, limit, windowMs);
      assert.strictEqual(exceededResult.allowed, false, 'Request exceeding limit should be blocked');
    });
  });

  describe('Confidence Engine Service', () => {
    it('should calculate confidence scores correctly for high quality inputs', () => {
      const result = confidenceEngine.evaluateConfidence({
        sources: [
          {
            sourceName: 'GitHub API',
            sourceUrl: 'https://api.github.com/users/octocat',
            dataType: 'api_endpoint',
            confidenceScore: 0.95,
            freshnessTimestamp: new Date().toISOString(),
          },
          {
            sourceName: 'Website Scraper',
            sourceUrl: 'https://octocat.dev',
            dataType: 'declared',
            confidenceScore: 0.90,
            freshnessTimestamp: new Date().toISOString(),
          },
        ],
        profileFieldCount: 5,
        hasGeoData: true,
      });

      assert.strictEqual(typeof result.confidenceScore, 'number');
      assert.ok(result.confidenceScore >= 85, 'Confidence score should be High (>= 85)');
      assert.strictEqual(result.confidenceLevel, 'High');
      assert.strictEqual(result.missingInformation.length, 0);
    });

    it('should identify missing information when geo data is absent', () => {
      const result = confidenceEngine.evaluateConfidence({
        sources: [],
        profileFieldCount: 1,
        hasGeoData: false,
      });

      assert.ok(result.missingInformation.length > 0, 'Should list missing info');
      assert.strictEqual(result.confidenceLevel, 'Low');
    });
  });
});
