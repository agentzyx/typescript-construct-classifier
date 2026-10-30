import "./types";

declare module "./types" {
  interface User {
    nickname?: string;
  }
}

declare global {
  interface Window {
    appVersion: string;
    buildId: string;
  }
}

export {};
