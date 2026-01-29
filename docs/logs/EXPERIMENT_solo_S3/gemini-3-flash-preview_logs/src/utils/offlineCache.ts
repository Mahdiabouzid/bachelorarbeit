const CACHE_PREFIX = 'lumen_cache_';

export const cacheAsset = (key: string, value: any) => {
  localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value));
};

export const getAsset = (key: string) => {
  const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
  return item ? JSON.parse(item) : null;
};

export const isOffline = () => {
  return localStorage.getItem('lumen.offline') === 'true';
};