export const cacheAsset = (key: string, value: any) => {
  sessionStorage.setItem(`lumen.cache.${key}`, JSON.stringify(value));
};

export const getAsset = (key: string) => {
  const item = sessionStorage.getItem(`lumen.cache.${key}`);
  return item ? JSON.parse(item) : null;
};

export const isOffline = () => {
  return sessionStorage.getItem('lumen.offline') === 'true';
};