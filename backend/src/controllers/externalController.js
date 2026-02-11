import { getCache, setCache } from "../services/cache.js";
import { enqueueJob } from "../services/jobQueue.js";

export const getJoke = async (_req, res) => {
  const cacheKey = "external:joke";
  const cached = getCache(cacheKey);

  if (cached) {
    return res.json({ source: "cache", data: cached });
  }

  try {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
    if (!response.ok) {
      return res.status(502).json({ message: "External API request failed" });
    }

    const data = await response.json();
    setCache(cacheKey, data, 60 * 1000);
    enqueueJob("external_api_success", { provider: "official-joke-api" });

    res.json({ source: "live", data });
  } catch {
    res.status(502).json({ message: "Unable to reach external API" });
  }
};
