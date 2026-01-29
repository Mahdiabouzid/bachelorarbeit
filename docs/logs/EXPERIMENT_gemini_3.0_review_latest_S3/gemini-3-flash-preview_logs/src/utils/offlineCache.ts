const CACHE_KEY = 'lumen.offlineCache';

export const cacheAsset = (key: string, data: string): void => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[key] = data;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to cache asset:', error);
  }
};

export const getAsset = (key: string): string | null => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return cache[key] || null;
  } catch (error) {
    console.error('Failed to retrieve asset:', error);
    return null;
  }
};