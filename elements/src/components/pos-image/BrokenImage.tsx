import { BrokenFile } from '@pod-os/core';
import { h } from '@stencil/core';

interface Props {
  file: BrokenFile;
}

export const BrokenImage = ({ file }: Props) => {
  return <div class="error">{file.toString()}</div>;
};
