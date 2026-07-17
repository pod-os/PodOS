import { Component, h, Host, Prop } from '@stencil/core';
import { sanitizeHtmlTool } from './sanitizeHtmlTool';

@Component({
  tag: 'pos-html-tool',
  shadow: false,
})
export class PosHtmlTool {
  /**
   * HTML fragment to sanitize and render
   */
  @Prop() fragment: string;

  render() {
    return <Host innerHTML={sanitizeHtmlTool(this.fragment)}></Host>;
  }
}
