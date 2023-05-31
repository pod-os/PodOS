import { newSpecPage } from '@stencil/core/testing';
import { fireEvent, screen } from '@testing-library/dom';
import { when } from 'jest-when';
import { mockPodOS } from '../../../test/mockPodOS';
import { PosNewThingForm } from '../pos-new-thing-form';

describe('pos-new-thing-form', () => {
  it('renders a form', async () => {
    const page = await newSpecPage({
      components: [PosNewThingForm],
      html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(
      `
        <pos-new-thing-form reference-uri="https://pod.test/container/">
          <form>
            <label>
              Type
              <pos-select-term></pos-select-term>
            </label>
            <label>
              Name
              <input type="text">
            </label>
            <div></div>
            <input type="submit" value="Create" disabled />
          </form>
        </pos-new-thing-form>`,
    );
  });

  describe('enabling and disabling the create button', () => {
    it('is disabled initially', async () => {
      await newSpecPage({
        components: [PosNewThingForm],
        html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
        supportsShadowDom: false,
      });
      const button: HTMLButtonElement = screen.getByDisplayValue('Create');

      expect(button.disabled).toBe(true);
    });

    it('is still disabled after selecting a term', async () => {
      // given
      const page = await newSpecPage({
        components: [PosNewThingForm],
        html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
        supportsShadowDom: false,
      });
      const button: HTMLButtonElement = screen.getByDisplayValue('Create');

      // when user selects a term
      const termSelect = page.root.querySelector('pos-select-term');
      fireEvent(
        termSelect,
        new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
      );

      // then the button is enabled
      expect(button.disabled).toBe(true);
    });

    it('is still disabled after entering a name', async () => {
      // given
      const page = await newSpecPage({
        components: [PosNewThingForm],
        html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
        supportsShadowDom: false,
      });
      const button: HTMLButtonElement = screen.getByDisplayValue('Create');

      // when user fills in a name
      const nameField = page.root.querySelector('input[type=text]');
      fireEvent.input(nameField, { target: { value: 'New Thing' } });
      await page.waitForChanges();

      // then the button is disabled
      expect(button.disabled).toBe(true);
    });

    it('is enabled after a term has been selected and a name typed', async () => {
      // given
      const page = await newSpecPage({
        components: [PosNewThingForm],
        html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
        supportsShadowDom: false,
      });
      const button: HTMLButtonElement = screen.getByDisplayValue('Create');

      // when user selects a term
      const termSelect = page.root.querySelector('pos-select-term');
      fireEvent(
        termSelect,
        new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
      );

      // and fills in a name
      const nameField = page.root.querySelector('input[type=text]');
      fireEvent.input(nameField, { target: { value: 'New Thing' } });
      await page.waitForChanges();

      // then the button is enabled
      expect(button.disabled).toBe(false);
    });

    it('is enabled when name is typed and then a term is selected', async () => {
      // given
      const page = await newSpecPage({
        components: [PosNewThingForm],
        html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
        supportsShadowDom: false,
      });
      const button: HTMLButtonElement = screen.getByDisplayValue('Create');

      // when user fills in a name
      const nameField = page.root.querySelector('input[type=text]');
      fireEvent.input(nameField, { target: { value: 'New Thing' } });

      // and after that selects a term
      const termSelect = page.root.querySelector('pos-select-term');
      fireEvent(
        termSelect,
        new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
      );
      await page.waitForChanges();

      // then the button is enabled
      expect(button.disabled).toBe(false);
    });
  });

  it('shows the URI of the new thing after typing a name', async () => {
    const page = await newSpecPage({
      components: [PosNewThingForm],
      html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
      supportsShadowDom: false,
    });

    const os = mockPodOS();
    when(os.proposeUriForNewThing)
      .calledWith('https://pod.test/container/', 'New Thing')
      .mockReturnValue('https://pod.test/container/new-thing#it');
    await page.rootInstance.receivePodOs(os);

    const nameField = page.root.querySelector('input[type=text]');
    fireEvent.input(nameField, { target: { value: 'New Thing' } });

    await page.waitForChanges();

    expect(os.proposeUriForNewThing).toHaveBeenCalledWith('https://pod.test/container/', 'New Thing');

    expect(page.root).toEqualHtml(
      `
        <pos-new-thing-form reference-uri="https://pod.test/container/">
          <form>
            <label>
              Type
              <pos-select-term></pos-select-term>
            </label>
            <label>
              Name
              <input type="text" value="New Thing">
            </label>
            <div>https://pod.test/container/new-thing#it</div>
            <input type="submit" value="Create" disabled />
          </form>
        </pos-new-thing-form>`,
    );
  });
});
