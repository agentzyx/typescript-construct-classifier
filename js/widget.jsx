/**
 * A JSX component written in JavaScript.
 * @param {{ label: string }} props
 */
export function Widget(props) {
  return <button class="widget primary">{props.label}</button>;
}
