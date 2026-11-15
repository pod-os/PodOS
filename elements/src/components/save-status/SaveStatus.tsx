import { h } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'failed';

interface Props {
  saveStatus: SaveStatus;
}

export function SaveStatusIndicator({ saveStatus }: Props) {
  if (saveStatus === 'pending') {
    return <Status status="pending" message="pending changes" icon="clock-history" />;
  }
  if (saveStatus === 'failed') {
    return <Status status="error" message="saving failed" icon="x-octagon" />;
  }
  if (saveStatus === 'saving') {
    return <Status status="saving" message="saving changes" icon="cloud-upload" />;
  }
  return <Status status="success" message="all saved" icon="check2-circle" />;
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
