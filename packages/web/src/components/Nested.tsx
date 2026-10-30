/** Defines a component inside another component. */
export function Outer({ names }: { names: string[] }) {
  function Row({ name }: { name: string }) {
    return <li>{name}</li>;
  }
  return (
    <ul>
      {names.map((n) => (
        <Row key={n} name={n} />
      ))}
    </ul>
  );
}
