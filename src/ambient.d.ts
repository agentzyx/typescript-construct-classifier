declare const BUILD_ID: string;
declare function track(event: string): void;
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [el: string]: unknown;
  }
}
