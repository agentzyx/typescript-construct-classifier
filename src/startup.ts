import { load } from "./functions";

let ready = false;

(async () => {
  await load("boot");
  ready = true;
})();

outer: for (const i of [1, 2]) {
  if (i > 0) break outer;
}

export function isReady() {
  return ready;
}
