/**
 * Roughly resembling RFC 7807 Problem Details
 * https://datatracker.ietf.org/doc/html/rfc7807
 */
export interface Problem {
  type: string;
  title: string;
  status?: number;
  detail?: string;
}

export interface NetworkProblem extends Problem {
  type: "network";
}

export interface HttpProblem extends Problem {
  type: "http";
}

export function httpProblem(title: string, response: Response): HttpProblem {
  return {
    type: "http",
    title,
    status: response.status,
    detail: `The server responded with ${response.status} ${response.statusText}`,
  };
}

export function networkProblem(title: string, cause: Error): NetworkProblem {
  return {
    type: "network",
    title,
    detail: `The server could not be reached: ${cause.message}`,
  };
}
