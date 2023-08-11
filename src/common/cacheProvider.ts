import Cache from "@aws-amplify/cache";
import { CacheItemOptions as AmplifyCacheInterface } from "@aws-amplify/cache/src/types/Cache";

Cache.configure({
  itemMaxSize: 400000, // 400kb
});

type CacheValue = string | number | boolean | Record<string, unknown> | unknown[];

const setItem = (key: string, value: CacheValue, options?: AmplifyCacheInterface): void =>
  Cache.setItem(key, value, options);
const getItem = (key: string, options?: AmplifyCacheInterface): CacheValue | unknown =>
  Cache.getItem(key, options);
const removeItem = (key: string): void => Cache.removeItem(key);
const clear = (): void => Cache.clear();

export default Object.freeze({
  setItem,
  getItem,
  removeItem,
  clear,
});
