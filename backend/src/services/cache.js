const cache = new Map();

export const setCache = (key, data, ttlMs) => {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
};

export const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

export const clearCache = (key) => {
  if (key) cache.delete(key);
};
