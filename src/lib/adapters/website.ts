import { ISocialAdapter, SocialAdapterResult } from "./types";
import * as cheerio from "cheerio";
import { fetchWithRetry } from "../utils/fetchWithRetry";

export class WebsiteAdapter implements ISocialAdapter {
  platform = "website";
  provider = "web-scraper" as const;

  supports(url: string): boolean {
    // Falls back to true for any URL since it is the generic web adapter
    return true;
  }

  async analyze(url: string): Promise<SocialAdapterResult> {
    try {
      const res = await fetchWithRetry(url, {
        headers: {
          "User-Agent": "SocialGraph-Atlas/1.0",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch website, status: ${res.status}`);
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      const title = $("title").text().trim() || "";
      const metaDescription = $('meta[name="description"]').attr("content") || "";
      const ogImage = $('meta[property="og:image"]').attr("content") || "";
      const ogTitle = $('meta[property="og:title"]').attr("content") || "";

      // Extract links to social media profiles
      const socialLinks: Array<{ platform: string; url: string }> = [];
      const links = $("a[href]");
      const domains = [
        { key: "github.com", name: "github" },
        { key: "twitter.com", name: "x" },
        { key: "x.com", name: "x" },
        { key: "instagram.com", name: "instagram" },
        { key: "linkedin.com", name: "linkedin" },
        { key: "youtube.com", name: "youtube" },
        { key: "tiktok.com", name: "tiktok" },
        { key: "reddit.com", name: "reddit" },
      ];

      links.each((_, el) => {
        const href = $(el).attr("href") || "";
        for (const item of domains) {
          if (href.toLowerCase().includes(item.key)) {
            socialLinks.push({ platform: item.name, url: href });
          }
        }
      });

      // Deduplicate social links
      const uniqueSocials = socialLinks.filter(
        (v, i, a) => a.findIndex((t) => t.url === v.url) === i
      );

      // Look for contact address clues in text
      const bodyText = $("body").text();
      const locationMatch = this.findLocationInText(bodyText);

      const profile = {
        url,
        handle: new URL(url).hostname,
        name: ogTitle || title || new URL(url).hostname,
        avatar: ogImage || "",
        bio: metaDescription,
        location: locationMatch || "",
        website: url,
        followers: null,
        following: null,
        posts: null,
        verified: null,
      };

      const connections = uniqueSocials.map((link) => {
        const handleMatch = link.url.split("/").filter(Boolean).pop();
        return {
          id: `entity-web-link-${link.platform}-${handleMatch || "user"}`,
          name: `${handleMatch || "Profile"} (${link.platform.toUpperCase()})`,
          platform: link.platform,
          relationType: "linked_profile",
          sourceUrl: url,
          confidence: 0.9,
          evidence: `Linked social profile found on home page: "${link.url}"`,
        };
      });

      const locations: SocialAdapterResult["locations"] = [];
      if (locationMatch) {
        locations.push({
          label: locationMatch,
          sourceUrl: url,
          confidence: 0.7,
          type: "declared" as const,
          lat: 0,
          lng: 0,
          evidence: `Discovered location mention in page text: "${locationMatch}"`,
        });
      }

      const evidence = [
        {
          id: `ev-web-html-${new URL(url).hostname}`,
          type: "metadata",
          sourceUrl: url,
          snippet: `Page Title: "${title}". Meta description: "${metaDescription}". Found ${uniqueSocials.length} social links.`,
          confidence: 0.95,
        },
      ];

      return {
        platform: "website",
        provider: this.provider,
        profile,
        connections,
        locations,
        evidence,
      };

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`Website Analysis Failed: ${message}`);
    }
  }

  private findLocationInText(text: string): string | null {
    // Simple regex matching for common cities or formats
    const patterns = [
      /Based in ([A-Za-z\s,]+)(?:\.|,|\n)/i,
      /Located in ([A-Za-z\s,]+)(?:\.|,|\n)/i,
      /Office: ([A-Za-z0-9\s,]+)(?:\.|,|\n)/i,
      /Headquarters:\s*([A-Za-z\s,]+)(?:\.|,|\n)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Default lookup for some prominent indicators
    if (text.includes("London, UK")) return "London, UK";
    if (text.includes("San Francisco")) return "San Francisco, CA";
    if (text.includes("New York")) return "New York, NY";
    if (text.includes("Berlin")) return "Berlin, Germany";

    return null;
  }

}
