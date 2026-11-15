import { Component, h, Prop } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'failed';

@Component({
  tag: 'pos-save-status',
  styleUrl: './pos-save-status.css',
  shadow: true,
})
export class PosSaveStatus {
  @Prop()
  saveStatus!: SaveStatus;

  render() {
    if (this.saveStatus === 'pending') {
      return <Status status="pending" message="pending changes" icon="clock-history" />;
    }
    if (this.saveStatus === 'failed') {
      return <Status status="error" message="saving failed" icon="x-octagon" />;
    }
    if (this.saveStatus === 'saving') {
      return <Status status="saving" message="saving changes" icon="cloud-upload" />;
    }
    return <Status status="success" message="all saved" icon="check2-circle" />;
  }
}

function Status({ status, icon, message }: { status: string; icon: string; message: string }) {
  return (
    <span
      class={{
        status: true,
        [status]: true,
      }}
      role="status"
      aria-live="polite"
      aria-labelledby="status-message"
    >
      <sl-icon name={icon} aria-hidden="true"></sl-icon>
      <span id="status-message">{message}</span>
    </span>
  );
}
