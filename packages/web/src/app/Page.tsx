/** An async server component. */
export default function Page() {
  const data = ["a", "b"];
  return <p>{data.join(", ")}</p>;
}
