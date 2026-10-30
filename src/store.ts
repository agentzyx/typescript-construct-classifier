export interface Store {
  get(id: string): string;
}

export class DbStore implements Store {
  get(id: string) {
    return "db" + id;
  }
}

export class MemStore implements Store {
  get(id: string) {
    return "mem" + id;
  }
}

export function handle(s: Store) {
  return s.get("1");
}

export function direct() {
  return new DbStore().get("2");
}
