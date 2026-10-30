export interface User {
  id: number;
  name: string;
  greet(msg: string): string;
  readonly tags?: string[];
}

export interface User {
  email?: string;
  phone?: string;
}

export interface Callable {
  (x: number): string;
  new (x: string): Callable;
  [key: string]: unknown;
}

export type Id = User["id"];
export type Status = "on" | "off";
export type ReadonlyUser = { readonly [K in keyof User]: User[K] };
export type Unwrap<T> = T extends Promise<infer U> ? U : T;
export type Route = `/api/${string}`;

export enum Color {
  Red,
  Green = "g".length,
  Blue = 3,
}

export const enum Dir {
  Up = 1,
  Down,
}

export namespace Geo {
  export function dist(a: number, b: number) {
    return Math.abs(a - b);
  }
  export namespace Inner {
    export const k = 1;
  }
}

export function tool() {
  return tool.version;
}
export namespace tool {
  export const version = 1;
}
