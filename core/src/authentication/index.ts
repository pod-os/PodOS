import { fetch, ISessionInfo } from "@inrupt/solid-client-authn-browser";
import * as authn from "@inrupt/solid-client-authn-browser";

export const handleIncomingRedirect = async () =>
  authn.handleIncomingRedirect({
    restorePreviousSession: true,
  });

export const login = (oidcIssuer: string = "http://localhost:3000") => {
  return authn.login({
    oidcIssuer,
    redirectUrl: window.location.href,
    clientName: `Pod OS at ${window.location.host}`,
  });
};

export const logout = () => {
  return authn.logout();
};

export const trackSession = (callback: (session: ISessionInfo) => unknown) => {
  const session = authn.getDefaultSession();
  session.onLogin(() => callback(session.info));
  session.onLogout(() => callback(session.info));
  session.onSessionRestore(() => callback(session.info));
  callback(session.info);
};

export const authenticatedFetch = fetch;
