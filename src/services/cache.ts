import fs from "fs";
import path from "path";

const CACHE_FILE = path.resolve("cache.json");

type CacheData = {
  filePath: string;
  timestamp: number;
};

export const loadCache = (): CacheData | null => {
  if (!fs.existsSync(CACHE_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8")) as CacheData;
  } catch {
    return null;
  }
};

export const saveCache = (data: CacheData): void => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data));
};

export const isCacheValid = (maxAgeMs: number): boolean => {
  const cache = loadCache();
  if (!cache) return false;
  const isValid =
    Date.now() - cache.timestamp < maxAgeMs && fs.existsSync(cache.filePath);
  return isValid;
};

export const getCachedFile = (): string | null => {
  const cache = loadCache();
  return cache?.filePath && fs.existsSync(cache.filePath)
    ? cache.filePath
    : null;
};
