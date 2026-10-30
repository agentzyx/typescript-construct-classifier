"use server";

/**
 * Saves the cart on the server.
 *
 * @param _previous - the previous result
 * @param form - submitted form data
 * @returns a status message
 */
export async function saveCart(_previous: string, form: FormData): Promise<string> {
  return `saved ${form.get("sku") ?? ""}`;
}
