import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer();

interface Options {
  delayedUntil?: Promise<void>;
}

export function turtleFile(url: string, content: string, { delayedUntil = Promise.resolve() }: Options = {}) {
  return http.get(url, async () => {
    const response = HttpResponse.text(content);
    response.headers.set('Content-Type', 'text/turtle');
    await delayedUntil;
    return response;
  });
}

export function notFound(url: string) {
  return http.get(url, async () => {
    return HttpResponse.text('Not found', {
      status: 404,
    });
  });
}
