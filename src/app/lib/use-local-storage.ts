import { useEffect, useState } from 'react';

function hashCode(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

export function useLocalStorage<T>(key: string, defaultData: T) {
  const sourceHash = hashCode(JSON.stringify(defaultData));
  const hashKey = `${key}_hash`;

  const [data, setData] = useState<T>(() => {
    if (localStorage.getItem(hashKey) !== sourceHash) {
      localStorage.removeItem(key);
      localStorage.setItem(hashKey, sourceHash);
      return defaultData;
    }
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  return [data, setData] as const;
}
