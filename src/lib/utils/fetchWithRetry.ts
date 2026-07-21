export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries: number = 3,
  backoff: number = 1000
): Promise<Response> {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      const response = await fetch(url, options);
      
      // If response is successful, or it's a 4xx error (client error, no point in retrying)
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response;
      }
      
      // If it's a 429 (Rate Limit) or 5xx (Server Error), we retry
      if (attempt === retries - 1) {
        return response; // Return the failed response on the last attempt
      }
      
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
    }
    
    // Exponential backoff
    const delay = backoff * Math.pow(2, attempt);
    await new Promise((resolve) => setTimeout(resolve, delay));
    attempt++;
  }
  
  throw new Error("Max retries reached");
}
