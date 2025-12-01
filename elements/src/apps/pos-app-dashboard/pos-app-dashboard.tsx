import { Component, h, Host } from '@stencil/core';

import session from '../../store/session';
import { WebIdProfile } from '@pod-os/core';

@Component({
  tag: 'pos-app-dashboard',
  styleUrl: 'pos-app-dashboard.css',
  shadow: true,
})
export class PosAppDashboard {
  render() {
    return (
      <Host>
        {session.state.isLoggedIn ? (
          <LoggedIn profile={session.state.profile}></LoggedIn>
        ) : (
          [<pos-getting-started></pos-getting-started>, <pos-example-resources></pos-example-resources>]
        )}
      </Host>
    );
  }
}

const LoggedIn = ({ profile }: { profile: WebIdProfile }) => {
  const publicTypeIndex = profile.getPublicTypeIndex();
  const privateTypeIndex = profile.getPrivateTypeIndex();
  return [
    <pos-example-resources></pos-example-resources>,
    publicTypeIndex ? <pos-type-index-entries uri={publicTypeIndex}></pos-type-index-entries> : null,
    privateTypeIndex ? <pos-type-index-entries uri={privateTypeIndex}></pos-type-index-entries> : null,
  ];
};
