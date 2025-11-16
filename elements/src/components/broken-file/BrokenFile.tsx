import { BrokenFile as BrokenFileData, HttpStatus } from '@pod-os/core';
import { h } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

interface Props {
  file: BrokenFileData;
}

export const BrokenFile = ({ file }: Props) => {
  const iconName = iconForStatus(file.status);
  return (
    <div>
      <a class="error" href={file.url}>
        <div>
          <sl-icon name={iconName}></sl-icon>
        </div>
        <div class="code">{file.status.code}</div>
        <div class="text">{file.status.text}</div>
      </a>
    </div>
  );
};

function iconForStatus(status: HttpStatus): string {
  switch (status.code) {
    case 401:
    case 403:
      return 'lock';
    case 404:
      return 'question-circle';
    default:
      return 'exclamation-circle';
  }
}
