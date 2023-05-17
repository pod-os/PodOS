import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-new-thing-form',
  styleUrl: 'pos-new-thing-form.css',
  shadow: true,
})
export class PosNewThingForm {
  render() {
    return (
      <form>
        <label>
          Type
          <pos-select-term />
        </label>
        <label>
          Name
          <input type="text" />
        </label>
        <input type="submit" value="Create" />
      </form>
    );
  }
}
