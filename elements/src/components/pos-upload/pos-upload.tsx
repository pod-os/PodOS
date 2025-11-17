import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-upload',
})
export class PosUpload {
  render() {
    return <input type="file" />;
  }
}
