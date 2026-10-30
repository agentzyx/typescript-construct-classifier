import "./types";

declare module "./types" {
  interface User {
    nickname?: string;
    avatarUrl?: string;
  }
}

declare global {
  interface Window {
    appVersion: string;
  }
}

export {};
