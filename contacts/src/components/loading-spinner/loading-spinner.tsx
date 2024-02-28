import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'pos-contacts-loading-spinner',
  styleUrl: './loading-spinner.css',
  shadow: true,
})
export class LoadingSpinner {
  @State()
  show = false;

  @Prop()
  defer = 300;

  componentWillLoad() {
    setTimeout(() => {
      this.show = true;
    }, this.defer);
  }
  render() {
    return this.show ? (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g id="dot">
          <circle cx="50" cy="10" r="9" />
        </g>

        <use href="#dot" transform="rotate(45, 50,50)" fill-opacity="0%" />
        <use href="#dot" transform="rotate(90, 50,50)" fill-opacity="25%" />
        <use href="#dot" transform="rotate(135, 50,50)" fill-opacity="50%" />
        <use href="#dot" transform="rotate(180, 50,50)" fill-opacity="75%" />
        <use href="#dot" transform="rotate(225, 50,50)" fill-opacity="100%" />
        <use href="#dot" transform="rotate(270, 50,50)" fill-opacity="100%" />
        <use href="#dot" transform="rotate(315, 50,50)" fill-opacity="100%" />
      </svg>
    ) : null;
  }
}
