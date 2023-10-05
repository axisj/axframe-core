import LZUTF8 from "lzutf8";

interface AppData {
  name: string;
  version: string;
  authorization: string;
  token: string;
}

export function setAppData(values: AppData) {
  localStorage.setItem(
    "appData",
    LZUTF8.compress(JSON.stringify(values), {
      outputEncoding: "StorageBinaryString",
    }),
  );
}

export function clearAppData() {
  localStorage.removeItem("appData");
}

export function updateAppData(key: keyof AppData, value: string) {
  const appData = localStorage.getItem("appData") ?? {};
  appData[key] = value;
  setAppData(appData as AppData);
}

export function getAppData(): AppData | null {
  const appData = localStorage.getItem("appData");
  if (appData) {
    try {
      return JSON.parse(
        LZUTF8.decompress(appData, {
          inputEncoding: "StorageBinaryString",
        }),
      );

      // console.log("state", state.me);
    } finally { /* empty */ }
  }

  return null;
}
