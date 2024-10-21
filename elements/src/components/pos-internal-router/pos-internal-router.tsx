import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-internal-router',
})
export class PosInternalRouter {
  @Prop()
  uri: string = 'pod-os:dashboard';

  render() {
    return <pos-app-dashboard></pos-app-dashboard>;
  }
}
