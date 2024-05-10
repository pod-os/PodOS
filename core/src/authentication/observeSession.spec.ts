import { EVENTS, Session } from "@inrupt/solid-client-authn-browser";
import { EventEmitter } from "events";
import { observeSession } from "./observeSession";

describe("observe session", () => {
  it("gets the current session info value", () => {
    // given a session that is not logged in
    const session: Session = {
      info: { isLoggedIn: false, sessionId: "test-session-id" },
      events: new EventEmitter(),
    } as Session;

    // when observing the session
    const subject = observeSession(session);

    // the current session value is also not logged in
    expect(subject.value).toEqual({
      isLoggedIn: false,
      sessionId: "test-session-id",
    });
  });

  it("gets the updated session value on login", () => {
    // given a session that is not logged in
    const session: Session = {
      info: { isLoggedIn: false, sessionId: "test-session-id" },
      events: new EventEmitter(),
    } as Session;

    // when observing the session
    const subject = observeSession(session);

    // and login occurs
    // @ts-ignore allow to write session info
    session["info"] = { isLoggedIn: true, sessionId: "test-session-id" };
    // @ts-ignore allow to emit for testing
    session.events.emit(EVENTS.LOGIN);

    // the current session value is changed to logged in
    expect(subject.value).toEqual({
      isLoggedIn: true,
      sessionId: "test-session-id",
    });
  });

  it("gets the updated session value on logout", () => {
    // given a session that is logged in
    const session: Session = {
      info: { isLoggedIn: true, sessionId: "test-session-id" },
      events: new EventEmitter(),
    } as Session;

    // when observing the session
    const subject = observeSession(session);

    // and logout occurs
    // @ts-ignore allow to write session info
    session["info"] = { isLoggedIn: false, sessionId: "test-session-id" };
    // @ts-ignore allow to emit for testing
    session.events.emit(EVENTS.LOGOUT);

    // the current session value is changed to logged in
    expect(subject.value).toEqual({
      isLoggedIn: false,
      sessionId: "test-session-id",
    });
  });

  it("gets the updated session value on session restore", () => {
    // given a session that is not logged in
    const session: Session = {
      info: { isLoggedIn: false, sessionId: "test-session-id" },
      events: new EventEmitter(),
    } as Session;

    // when observing the session
    const subject = observeSession(session);

    // and session restore occurs
    // @ts-ignore allow to write session info
    session["info"] = { isLoggedIn: true, sessionId: "test-session-id" };
    // @ts-ignore allow to emit for testing
    session.events.emit(EVENTS.SESSION_RESTORED);

    // the current session value is changed to logged in
    expect(subject.value).toEqual({
      isLoggedIn: true,
      sessionId: "test-session-id",
    });
  });
});
