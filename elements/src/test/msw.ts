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

export function binaryResource(url: string, describedBy: string, contentType: string = 'application/pdf') {
  return http.get(url, async () => {
    const response = new HttpResponse(null, {
      headers: {
        'Content-Type': contentType,
        'Link': `<${describedBy}>; rel="describedby"`,
      },
    });
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
