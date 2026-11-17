import type { Config, Context } from "@netlify/edge-functions";

/**
 * Content negotiation for the PodOS tools vocabulary.
 *
 * `https://pod-os.org/vocab/tools` hosts Turtle and HTML, with Turtle as default.
 *
 * This edge function borrows the body of the static files `/vocab/tools.ttl` or `/vocab/tools/` using `next()`
 *
 */

const VOCABULARY_PATH = "/vocab/tools";
const PAGE_PATH = "/vocab/tools/";
const TURTLE_PATH = "/vocab/tools.ttl";

export type Representation = "html" | "turtle";

/** The URL that serves each representation. */
const TARGETS: Record<Representation, string> = {
  html: PAGE_PATH,
  turtle: TURTLE_PATH,
};

/** Accepted content types for the documentation page. */
const HTML_TYPES = ["text/html"];

/** Accepted content types for the turtle. */
const TURTLE_TYPES = ["text/turtle"];

interface MediaRange {
  media: string;
  q: number;
}

/** Parses an `Accept` header into media ranges with their quality values. */
export function parseAccept(header: string | null): MediaRange[] {
  if (!header) return [];

  const ranges: MediaRange[] = [];
  for (const part of header.split(",")) {
    const [media, ...parameters] = part
      .split(";")
      .map((value) => value.trim().toLowerCase());
    if (!media) continue;

    let q = 1;
    for (const parameter of parameters) {
      const match = /^q=([0-9.]+)$/.exec(parameter);
      if (match) q = Number(match[1]);
    }

    if (Number.isFinite(q) && q > 0) ranges.push({ media, q });
  }

  return ranges;
}

/** True if HTML has the (equal) highest q value */
export function prefersHtml(header: string | null): boolean {
  const ranges = parseAccept(header);
  const quality = (...types: string[]) =>
    Math.max(
      0,
      ...ranges
        .filter((range) => types.includes(range.media))
        .map((range) => range.q),
    );

  const html = quality(...HTML_TYPES);
  return html > 0 && html >= Math.max(quality(...TURTLE_TYPES), quality("*/*"));
}

/** Merges a value into `Vary` without dropping the ones the origin already sent. */
function appendVary(vary: string | null, value: string): string {
  if (!vary) return value;

  const values = vary.split(",").map((entry) => entry.trim().toLowerCase());
  if (values.includes("*") || values.includes(value.toLowerCase())) return vary;

  return `${vary}, ${value}`;
}

export default async function handler(
  request: Request,
  context: Context,
): Promise<Response> {
  // Enable CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, HEAD",
        // Allow authenticated fetch with long accept
        "access-control-allow-headers": "accept, authorization, dpop",
        // Preflight only needed every 10min
        "access-control-max-age": "600",
      },
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed\n", {
      status: 405,
      headers: { allow: "GET, HEAD", "access-control-allow-origin": "*" },
    });
  }

  const url = new URL(request.url);
  const representation: Representation = prefersHtml(
    request.headers.get("accept"),
  )
    ? "html"
    : "turtle";

  const upstream = await context.next(
    new Request(new URL(TARGETS[representation], url), {
      method: request.method,
      headers: { accept: "*/*" },
    }),
  );

  const headers = new Headers(upstream.headers);
  const alternate = representation === "turtle" ? "text/html" : "text/turtle";

  headers.set("vary", appendVary(headers.get("vary"), "Accept"));
  headers.set("access-control-allow-origin", "*");
  headers.append(
    "link",
    `<${url.origin}${VOCABULARY_PATH}>; rel="alternate"; type="${alternate}"`,
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}

export const config: Config = {
  pattern: "^/vocab/tools$",
};
