import { expect, Mock } from "vitest";

/**
 * Expect that a PATCH request has been performed
 * @param authenticatedFetch - A mocked fetch function
 * @param url - The expected URL to PATCH
 * @param expectedBody - The expected request body
 */
export function expectPatchRequest(
  authenticatedFetch: Mock,
  url: string,
  expectedBody: string,
) {
  expect(authenticatedFetch).toHaveBeenCalledWith(url, expect.anything());

  const calls = authenticatedFetch.mock.calls;
  const updateRequest = calls.find(
    (it) => it[0] === url && it[1].method === "PATCH",
  );
  expect(updateRequest).toBeDefined();
  const body = updateRequest![1].body;
  expect(body.trim()).toEqual(expectedBody);
}
