import { ISocialAdapter, SocialAdapterResult } from "./types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { logger } from "../logger";

export class RedditAdapter implements ISocialAdapter {
  platform = "reddit";
  provider = "reddit-api" as const;

  supports(url: string): boolean {
    return url.toLowerCase().includes("reddit.com");
  }

  async analyze(url: string): Promise<SocialAdapterResult> {
    const username = this.extractUsername(url);
    if (!username) {
      throw new Error("Invalid Reddit profile URL.");
    }

    try {
      // Reddit allows public JSON suffixing for user details
      const res = await fetchWithRetry(`https://www.reddit.com/user/${username}/about.json`, {
        headers: {
          "User-Agent": "SocialGraph-Atlas/1.0",
        },
      });

      if (!res.ok) {
        throw new Error(`Reddit API returned status ${res.status}`);
      }

      const raw = await res.json();
      const user = raw.data;

      const profile = {
        url: `https://www.reddit.com/user/${username}`,
        handle: username,
        name: user.subreddit?.title || username,
        avatar: user.icon_img ? user.icon_img.split("?")[0] : "",
        bio: user.subreddit?.public_description || "",
        location: "",
        website: "",
        followers: user.subreddit?.subscribers || 0,
        following: null,
        posts: user.link_karma + user.comment_karma,
        verified: user.verified || false,
      };

      const connections: SocialAdapterResult["connections"] = [];
      const locations: SocialAdapterResult["locations"] = [];
      const evidence = [
        {
          id: `ev-reddit-json-${username}`,
          type: "API",
          sourceUrl: `https://www.reddit.com/user/${username}/about.json`,
          snippet: JSON.stringify({
            name: user.name,
            total_karma: user.link_karma + user.comment_karma,
            created_utc: user.created_utc,
            is_gold: user.is_gold,
          }),
          confidence: 0.95,
        },
      ];

      // Parse locations or subreddits mentioned in description
      const desc = user.subreddit?.public_description || "";
      const isLondon = desc.toLowerCase().includes("london");
      const isSF = desc.toLowerCase().includes("sf") || desc.toLowerCase().includes("san francisco");
      
      if (isLondon) {
        locations.push({
          label: "London, UK",
          city: "London",
          country: "United Kingdom",
          lat: 51.5074,
          lng: -0.1278,
          sourceUrl: `https://www.reddit.com/user/${username}`,
          confidence: 0.6,
          type: "inferred" as const,
          evidence: `Discovered 'London' keyword in Reddit subreddit description: "${desc}"`,
        });
      } else if (isSF) {
        locations.push({
          label: "San Francisco, CA",
          city: "San Francisco",
          state: "California",
          country: "United States",
          lat: 37.7749,
          lng: -122.4194,
          sourceUrl: `https://www.reddit.com/user/${username}`,
          confidence: 0.6,
          type: "inferred" as const,
          evidence: `Discovered 'SF' / 'San Francisco' keyword in Reddit subreddit description: "${desc}"`,
        });
      }

      // Fetch real subreddits the user has posted to
      try {
        const postsRes = await fetchWithRetry(`https://www.reddit.com/user/${username}/submitted.json?limit=10`, {
          headers: { "User-Agent": "SocialGraph-Atlas/1.0" },
        });
        if (postsRes.ok) {
          const postsRaw = await postsRes.json();
          const children: Array<{ data?: { subreddit_name_prefixed?: string } }> = postsRaw.data?.children || [];
          const subreddits = new Set<string>();
          children.forEach((c) => {
            if (c.data?.subreddit_name_prefixed) {
              subreddits.add(c.data.subreddit_name_prefixed);
            }
          });
          subreddits.forEach((sub) => {
            connections.push({
              id: `entity-reddit-sub-${sub.replace(/[^a-zA-Z0-9]/g, "")}`,
              name: sub,
              platform: "reddit",
              relationType: "collaborated",
              sourceUrl: `https://www.reddit.com/user/${username}`,
              confidence: 0.85,
              evidence: `Public post history shows active participation in ${sub}`,
            });
          });
        }
      } catch (e) {
        logger.warn("Failed to fetch user subreddits", {}, undefined, e);
      }

      return {
        platform: "reddit",
        provider: this.provider,
        profile,
        connections,
        locations,
        evidence,
      };

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`Reddit API Analysis Failed: ${message}`);
    }
  }

  private extractUsername(url: string): string | null {
    try {
      const parsed = new URL(url);
      const paths = parsed.pathname.split("/").filter(Boolean);
      // handles both /u/username and /user/username
      if (paths[0] === "user" || paths[0] === "u") {
        return paths[1] || null;
      }
      return paths[0] || null;
    } catch {
      return null;
    }
  }

}
export default RedditAdapter;
