import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { vi } from 'vitest';
import { when } from 'vitest-when';

export const server = setupServer();

const TEST_IDP = 'https://idp.test/';

const IDP_PRIVATE_JWK = {
  kty: 'EC',
  x: 'exnsKuOatDQI2Rp9S4Z0h8Z1aPOkSMzXlo4WMEPj-pQ',
  y: 'vZgLewgxtPtcZ0vZi-wN5W3Oiz-efBTjIbVHqa_vGaU',
  crv: 'P-256',
  d: 'rv-gRawFcHM6C9xpkCj9QOXr6wUMRZFnzszNhR-T_BA',
  kid: 'test-key-1',
};

const IDP_PUBLIC_JWK = {
  kty: 'EC',
  x: 'exnsKuOatDQI2Rp9S4Z0h8Z1aPOkSMzXlo4WMEPj-pQ',
  y: 'vZgLewgxtPtcZ0vZi-wN5W3Oiz-efBTjIbVHqa_vGaU',
  crv: 'P-256',
  kid: 'test-key-1',
  use: 'sig',
  alg: 'ES256',
};

interface Options {
  delayedUntil?: Promise<void>;
  once?: boolean;
}

export const forever = new Promise<void>(() => {});

export function turtleFile(
  url: string,
  content: string,
  { delayedUntil = Promise.resolve(), once = false }: Options = {},
) {
  return http.get(
    url,
    async () => {
      const response = HttpResponse.text(content);
      response.headers.set('Content-Type', 'text/turtle');
      response.headers.set('accept-patch', 'text/n3, application/sparql-update');
      response.headers.set('wac-allow', 'user="append control read write",public="append control read write"');
      await delayedUntil;
      return response;
    },
    { once },
  );
}

export function binaryResource(url: string, describedBy: string, contentType: string = 'application/pdf') {
  return http.get(
    url,
    async () =>
      new HttpResponse(null, {
        headers: {
          'Content-Type': contentType,
          'Link': `<${describedBy}>; rel="describedby"`,
        },
      }),
  );
}

export function jpeg(url: string, data: string) {
  return http.get(url, async () => {
    const jpgResponse = HttpResponse.text(data, {
      headers: {
        'Content-Type': 'image/jpg',
        'Link': `<${url}>; rel="describedby"`,
      },
    });
    const jpgBlob = await jpgResponse.blob();
    vi.spyOn(URL, 'createObjectURL');
    when(URL.createObjectURL).calledWith(jpgBlob).thenReturn(`blob:${data}`);
    return jpgResponse;
  });
}

export function notFound(url: string, { once = false }: { once?: boolean } = {}) {
  return http.get(
    url,
    async () => {
      return HttpResponse.text('Not found', {
        status: 404,
      });
    },
    { once },
  );
}

export function authenticatedUser(webId: string) {
  window.location.href = `https://authenticated-user.app.test?code=21sdfsdf23&iss=${TEST_IDP}&state=test-state`;
  sessionStorage.setItem('idp', TEST_IDP);
  sessionStorage.setItem('pkce_code_verifier', 'test-verifier');
  sessionStorage.setItem('client_id', 'test-client');
  sessionStorage.setItem('token_endpoint', `${TEST_IDP}/token`);
  sessionStorage.setItem('jwks_uri', `${TEST_IDP}/jwks`);
  sessionStorage.setItem('csrf_token', 'test-state');
  return [
    http.post(`${TEST_IDP}/token`, async ({ request }) => {
      const dpop = request.headers.get('dpop')!;
      const clientJwk = JSON.parse(b64urlDecode(dpop.split('.')[0])).jwk;
      const jkt = await jwkThumbprint(clientJwk);
      const clientId = new URLSearchParams(await request.text()).get('client_id')!;
      return HttpResponse.json({
        access_token: await mintAccessToken({ jkt, clientId, webId }),
        refresh_token: 'fake-refresh-token',
        token_type: 'DPoP',
        expires_in: 300,
      });
    }),
    http.get(`${TEST_IDP}/jwks`, async () => {
      return HttpResponse.json({ keys: [IDP_PUBLIC_JWK] });
    }),
  ];
}

function b64urlEncode(buf: Uint8Array | ArrayBuffer) {
  return btoa(String.fromCodePoint(...new Uint8Array(buf)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

function b64urlDecode(str: string) {
  return atob(str.replaceAll('-', '+').replaceAll('_', '/'));
}

async function jwkThumbprint(jwk: any) {
  const canonical = `{"crv":"${jwk.crv}","kty":"${jwk.kty}","x":"${jwk.x}","y":"${jwk.y}"}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  return b64urlEncode(digest);
}

async function mintAccessToken({ jkt, clientId, webId }: { jkt: string; clientId: string; webId: string }) {
  const key = await crypto.subtle.importKey('jwk', IDP_PRIVATE_JWK, { name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
  ]);
  const now = Math.floor(Date.now() / 1000);
  const encode = (obj: object) => b64urlEncode(new TextEncoder().encode(JSON.stringify(obj)));

  const signingInput =
    encode({ alg: 'ES256', kid: 'test-key-1', typ: 'at+jwt' }) +
    '.' +
    encode({
      iss: TEST_IDP,
      aud: 'solid',
      sub: webId,
      webid: webId,
      client_id: clientId,
      cnf: { jkt },
      iat: now,
      exp: now + 300,
    });

  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(signingInput));
  return signingInput + '.' + b64urlEncode(sig);
}
