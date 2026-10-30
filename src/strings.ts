export function sql() {
  const q = `
SELECT id
FROM users
WHERE active = 1
`;
  return q;
}

const tag = (s: TemplateStringsArray, ...v: unknown[]) => s.join("|") + v.length;
export const tagged = tag`a${1}b`;
