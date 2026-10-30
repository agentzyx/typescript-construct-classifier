/** Defines a component inside another component. */
export function Outer({ names }: { names: string[] }) {
  function Row({ label }: { label: string }) {
    return <li>{label}</li>;
  }
  return (
    <ul>
      {names.map((n) => (
        <Row key={n} name={n} />
      ))}
    </ul>
  );
}
