import { BrokenFile } from '@pod-os/core';
import { h } from '@stencil/core';

interface Props {
  file: BrokenFile;
}

export const BrokenImage = ({ file }: Props) => {
  return (
    <a href={file.url}>
      <div class="error">
        <div>
          <ion-icon name="close-circle-outline"></ion-icon>
        </div>
        <div class="message">{file.toString()}</div>
      </div>
    </a>
  );
};
