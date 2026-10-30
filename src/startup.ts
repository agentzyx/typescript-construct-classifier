import { load } from "./functions";

let ready = false;

(async () => {
  await load("startup");
  ready = true;
})();

outer: for (const i of [1, 2]) {
  if (i > 1) break outer;
}

export function isReady() {
  return ready;
}
