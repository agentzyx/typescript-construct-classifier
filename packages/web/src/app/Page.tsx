/** An async server component. */
export default async function Page() {
  const data = await Promise.resolve(["a", "b"]);
  return <p>{data.join(", ")}</p>;
}
