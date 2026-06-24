import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer();

export function turtleFile(url: string, content: string) {
  return http.get(url, async () => {
    const response = HttpResponse.text(content);
    response.headers.set('Content-Type', 'text/turtle');
    return response;
  });
}
