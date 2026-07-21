import { jobService } from "../services/JobService";

export async function createAnalysisJob(url: string): Promise<string> {
  return jobService.createJob(url);
}

export async function processJob(jobId: string): Promise<void> {
  return jobService.processJob(jobId);
}
