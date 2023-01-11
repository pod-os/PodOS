import { BrokenFile as BrokenFileData, HttpStatus } from '@pod-os/core';
import { h } from '@stencil/core';

interface Props {
  file: BrokenFileData;
}

export const BrokenFile = ({ file }: Props) => {
  const iconName = iconForStatus(file.status);
  return (
    <div>
      <a class="error" href={file.url}>
        <div>
          <ion-icon name={iconName}></ion-icon>
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
      return 'lock-closed-outline';
    case 404:
      return 'help-circle-outline';
    default:
      return 'alert-circle-outline';
  }
}
