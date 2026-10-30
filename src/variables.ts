export const LIMIT = 10;
export let counterVar = 0, step = 2;

export const fmt = (x: unknown): string => {
  return String(x).trim();
};

export const legacyFn = function named(n: number) {
  return n * 2;
};

export const api = {
  base: "/api",
  get(url: string) {
    return fetch(this.base + url);
  },
  post: async (url: string) => {
    return fetch(url, { method: "POST" });
  },
  get version() {
    return 1;
  },
  ["computed" + "Key"]: () => 1,
};

export const { a: alpha, b: beta } = { a: 1, b: 2 };
export const config = { mode: "dev" } satisfies Record<string, string>;
export const tuple = [1, 2] as const;

function withRetry<T extends (...args: any[]) => Promise<unknown>>(fn: T): T {
  return fn;
}

export const fetchUser = withRetry(async (id: number) => {
  return { id, name: "user" + id };
});
