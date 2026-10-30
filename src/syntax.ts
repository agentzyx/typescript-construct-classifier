/// <reference path="./ambient.d.ts" />
import Inner = Geo.Inner;
import { Geo } from "./types";
import data from "./data.json" with { type: "json" };
export import InnerAlias = Geo.Inner;

export const innerK = Inner.k;

let ticks = 0;
--ticks;
++ticks;

/** Severity levels (a value and a type sharing one name). */
export const Level = { low: 1, high: 2 } as const;
export type Level = (typeof Level)[keyof typeof Level];

export type Pair = [first: string, second?: number, ...rest: boolean[]];
export type Loose = [string, number?, ...boolean[]];
export const dataName = data.name;
export const holes = [1, , 3];
export type Both = { a: number } & { b: string };
export type UserFromImport = import("./types").User;
export type KOf = typeof Geo.Inner.k;

export const token: unique symbol = Symbol("token");
export const big: bigint = 10n;
export const pattern = /^[a-z]+\d*$/gi;
export const missing: undefined = undefined;
export const sym: symbol = Symbol.iterator;

declare enum Ambient {
  One = 1,
}
export const ambientOne: Ambient = 1;

export interface Box<in out T> {
  value: T;
  get size(): number;
  set size(v: number);
}

export interface Named {
  name: string;
}

export interface Pet extends Named {
  legs: number;
}

export abstract class Animal {
  protected abstract sound: string;
  static create(): string {
    return "creature";
  }
  speak?(): string;
}

export class Container<T> {
  constructor(value: T);
  constructor(value: T, label: string);
  constructor(private value: T, protected label = "box") {}

  get(): T;
  get(fallback: T): T;
  get(fallback?: T): T {
    return this.value ?? (fallback as T);
  }

  self(): this {
    return this;
  };
}

export function identityConst<const T extends readonly unknown[]>(items: T): T {
  return items;
}

export function Legacy(this: unknown) {
  if (!new.target) throw new Error("use new");
}

export function control(values: Record<string, number>): number {
  let total = 0;
  for (const key in values) {
    if (key.startsWith("_")) continue;
    total += values[key] ?? 0;
  }
  let i = 0;
  while (i < 3) i++;
  do {
    i--;
  } while (i > 0);
  try {
    total += JSON.parse("1") as number;
  } catch (err) {
    total -= err instanceof Error ? 1 : 0;
  } finally {
    total += 0;
  }
  ;
  return total;
}

export function expressions(input: { a: number; b?: number }) {
  const copy: { a: number; b?: number } = { ...input };
  delete copy.b;
  void copy.a;
  const [, second] = [1, 2];
  const cast = <number>(<unknown>second);
  const url = import.meta.url;
  return { copy, cast, url };
}

export function debugOnly(flag: boolean) {
  if (flag) debugger;
  return flag;
}

await Promise.resolve();

export async function withAsyncResource() {
  await using res = { async [Symbol.asyncDispose]() {} };
  return res;
}

function tag(label: string) {
  return function <T>(value: T, _context: ClassMethodDecoratorContext): T {
    void label;
    return value;
  };
}

export class Tagged {
  @tag("v1")
  run() {
    return 1;
  }
}

export function left(n: number): number {
  return n - 1;
}

export function right(n: number): number {
  return n + 1;
}
