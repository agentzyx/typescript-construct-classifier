import { Profile as P } from "./user";

export function loadProfile(id: number): P {
  return { id, name: "a" };
}

const p = loadProfile(1);

function greet(x: { name: string }) {
  return x.name;
}

export const greeting = greet(p);
