import * as authn from "@inrupt/solid-client-authn-browser";
authn
  .handleIncomingRedirect({
  restorePreviousSession: true,
})
  .then(() => null);
export const login = (oidcIssuer = "http://localhost:3000") => {
  return authn.login({
    oidcIssuer,
    redirectUrl: window.location.href,
    clientName: `Pod OS at ${window.location.host}`,
  });
};
export const logout = () => {
  return authn.logout();
};
export const trackSession = (callback) => {
  const session = authn.getDefaultSession();
  session.onLogin(() => callback(session.info));
  session.onLogout(() => callback(session.info));
  session.onSessionRestore(() => callback(session.info));
};
