import {
  EVENTS,
  ISessionInfo,
  Session,
} from "@inrupt/solid-client-authn-browser";
import { BehaviorSubject, fromEvent, map, merge } from "rxjs";
import { SessionInfo } from "./index";

export function observeSession(session: Session): BehaviorSubject<SessionInfo> {
  const sessionInfoSubject = new BehaviorSubject<ISessionInfo>(session.info);
  const login = fromEvent(session.events, EVENTS.LOGIN);
  const logout = fromEvent(session.events, EVENTS.LOGOUT);
  const sessionRestored = fromEvent(session.events, EVENTS.SESSION_RESTORED);
  merge(login, logout, sessionRestored)
    .pipe(map(() => sessionInfoSubject.next(session.info)))
    .subscribe();
  return sessionInfoSubject;
}
