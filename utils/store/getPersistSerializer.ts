import { del, get, set } from "idb-keyval";
import LZUTF8 from "lzutf8";
import { PersistOptions } from "zustand/middleware";

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }
  return value;
}

function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

export function getPersistSerializer<T>(
  storeName: string,
  storeVersion: number = 1,
  deserializeFallback?: (state: { state: T; version?: number }) => void,
): PersistOptions<T> {
  return {
    version: storeVersion,
    name: `store-${storeName}`,
    migrate: async (state: any, version: number) => {
      console.log(`store-${storeName} migrate`, version);
      return state;
    },
    storage: {
      getItem: async (name) => {
        const value: string | undefined = await get(name);

        try {
          const storageValue = value
            ? JSON.parse(
                LZUTF8.decompress(value, {
                  inputEncoding: "StorageBinaryString",
                }),
                reviver,
              )
            : { state: {} };

          storageValue.state.loaded = false;

          if (deserializeFallback) {
            return deserializeFallback(storageValue);
          }

          return storageValue;
        } catch (e) {
          console.error(`store-${storeName} getItem`, name, e);
          return null;
        }
      },
      setItem: async (name, value) => {
        const storageValue = LZUTF8.compress(JSON.stringify(value, replacer), {
          outputEncoding: "StorageBinaryString",
        });

        set(name, storageValue);
      },
      removeItem: async (name) => {
        await del(name);
      },
    },
  };
}
