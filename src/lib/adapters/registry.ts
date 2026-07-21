import { ISocialAdapter } from "./types";
import { GitHubAdapter } from "./github";
import { WebsiteAdapter } from "./website";
import { RedditAdapter } from "./reddit";
import { MockSocialAdapter } from "./mock";

export function getAdapterForUrl(url: string): ISocialAdapter {
  const normalized = url.toLowerCase();
  const platform = detectPlatform(normalized);

  if (platform === "github") {
    return new GitHubAdapter();
  }
  if (platform === "reddit") {
    return new RedditAdapter();
  }
  if (["instagram", "x", "linkedin", "youtube", "tiktok"].includes(platform)) {
    return new MockSocialAdapter(platform);
  }

  // Fallback to generic website adapter
  return new WebsiteAdapter();
}

export function detectPlatform(url: string): string {
  const normalized = url.toLowerCase();
  if (normalized.includes("github.com")) return "github";
  if (normalized.includes("reddit.com")) return "reddit";
  if (normalized.includes("instagram.com")) return "instagram";
  if (normalized.includes("twitter.com") || normalized.includes("x.com")) return "x";
  if (normalized.includes("linkedin.com")) return "linkedin";
  if (normalized.includes("youtube.com")) return "youtube";
  if (normalized.includes("tiktok.com")) return "tiktok";
  return "website";
}

