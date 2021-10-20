import { Component } from '@stencil/core';

import session from '../../store/session';

@Component({
  tag: 'pos-track-session',
})
export class PosTrackSession {
  componentWillLoad() {
    session.track();
  }
  render() {}
}
