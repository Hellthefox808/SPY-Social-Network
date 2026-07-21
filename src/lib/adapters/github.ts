import { ISocialAdapter, SocialAdapterResult } from "./types";
import { fetchWithRetry } from "../utils/fetchWithRetry";

export class GitHubAdapter implements ISocialAdapter {
  platform = "github";

  supports(url: string): boolean {
    return url.toLowerCase().includes("github.com");
  }

  async analyze(url: string): Promise<SocialAdapterResult> {
    const username = this.extractUsername(url);
    if (!username) {
      throw new Error("Invalid GitHub profile URL.");
    }

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "SocialGraph-Atlas",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
      const userRes = await fetchWithRetry(`https://api.github.com/users/${username}`, { headers });
      if (!userRes.ok) {
        throw new Error(`GitHub API returned status ${userRes.status}`);
      }
      const userData = await userRes.json();

      let orgsData: Array<{ login: string }> = [];
      try {
        const orgsRes = await fetchWithRetry(`https://api.github.com/users/${username}/orgs`, { headers });
        if (orgsRes.ok) orgsData = await orgsRes.json();
      } catch (e) {
        console.warn("Failed to fetch GitHub orgs", e);
      }

      let reposData: Array<{ name: string; homepage?: string; html_url: string }> = [];
      try {
        const reposRes = await fetchWithRetry(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers });
        if (reposRes.ok) reposData = await reposRes.json();
      } catch (e) {
        console.warn("Failed to fetch GitHub repos", e);
      }

      const profile = {
        url: `https://github.com/${username}`,
        handle: username,
        name: userData.name || username,
        avatar: userData.avatar_url,
        bio: userData.bio || "",
        location: userData.location || "",
        website: userData.blog || "",
        followers: userData.followers || 0,
        following: userData.following || 0,
        posts: userData.public_repos || 0,
        verified: userData.site_admin || false,
      };

      const connections: SocialAdapterResult["connections"] = [];
      const locations: SocialAdapterResult["locations"] = [];
      const evidence: SocialAdapterResult["evidence"] = [];

      evidence.push({
        id: `ev-gh-profile-${username}`,
        type: "API",
        sourceUrl: `https://api.github.com/users/${username}`,
        snippet: JSON.stringify({
          login: userData.login,
          name: userData.name,
          location: userData.location,
          company: userData.company,
          blog: userData.blog,
        }),
        confidence: 0.98,
      });

      if (userData.location) {
        locations.push({
          label: userData.location,
          sourceUrl: `https://github.com/${username}`,
          confidence: 0.95,
          type: "declared" as const,
          lat: 0,
          lng: 0,
          evidence: `GitHub profile location field: "${userData.location}"`,
        });
      }

      if (userData.company) {
        connections.push({
          id: `entity-comp-${userData.company.replace(/[^a-zA-Z0-9]/g, "")}`,
          name: userData.company,
          relationType: "same_org",
          sourceUrl: `https://github.com/${username}`,
          confidence: 0.9,
          evidence: `GitHub profile lists company: "${userData.company}"`,
        });
      }

      orgsData.forEach((org) => {
        connections.push({
          id: `entity-org-${org.login}`,
          name: org.login,
          relationType: "same_org",
          sourceUrl: `https://github.com/${username}/orgs`,
          confidence: 0.95,
          evidence: `Belongs to public organization: "${org.login}"`,
        });
      });

      reposData.forEach((repo) => {
        if (repo.homepage) {
          connections.push({
            id: `entity-web-${repo.name}`,
            name: repo.homepage,
            relationType: "same_domain",
            sourceUrl: repo.html_url,
            confidence: 0.85,
            evidence: `Homepage URL for repository "${repo.name}": "${repo.homepage}"`,
          });
        }
      });

      return {
        platform: "github",
        profile,
        connections,
        locations,
        evidence,
      };

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`GitHub API Analysis Failed: ${message}`);
    }
  }

  private extractUsername(url: string): string | null {
    try {
      const parsed = new URL(url);
      const paths = parsed.pathname.split("/").filter(Boolean);
      return paths[0] || null;
    } catch {
      return null;
    }
  }

}
