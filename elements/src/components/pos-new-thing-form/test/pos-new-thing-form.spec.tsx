import { PodOS } from '@pod-os/core';
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
          <form method="dialog">
            <label htmlFor="type">
              Type
            </label>
            <pos-select-term id="type" placeholder=""></pos-select-term>
            <label htmlFor="name">
              Name
            </label>
            <input id="name" type="text">
            <input id="create" type="submit" value="Create" disabled>
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

      const os = mockPodOS();
      await page.rootInstance.receivePodOs(os);

      // when user fills in a name
      const nameField = page.root.querySelector('input[type=text]');
      fireEvent.input(nameField, { target: { value: 'New Thing' } });
      await page.waitForChanges();

      // then the button is disabled
      const button: HTMLButtonElement = screen.getByDisplayValue('Create');
      expect(button.disabled).toBe(true);
    });

    it('is enabled after a term has been selected and a name typed', async () => {
      // given
      const page = await newSpecPage({
        components: [PosNewThingForm],
        html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
        supportsShadowDom: false,
      });
      const os = mockPodOS();
      await page.rootInstance.receivePodOs(os);

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
      const button: HTMLButtonElement = screen.getByDisplayValue('Create');
      expect(button.disabled).toBe(false);
    });

    it('is enabled when name is typed and then a term is selected', async () => {
      // given
      const page = await newSpecPage({
        components: [PosNewThingForm],
        html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
        supportsShadowDom: false,
      });
      const os = mockPodOS();
      await page.rootInstance.receivePodOs(os);

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
      const button: HTMLButtonElement = screen.getByDisplayValue('Create');
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
          <form method="dialog">
            <label htmlFor="type">
              Type
            </label>
            <pos-select-term id="type" placeholder=""></pos-select-term>
            <label htmlFor="name">
              Name
            </label>
            <input id="name" type="text" value="New Thing">
            <div id="new-uri" title="This will be the URI of the new thing">
              https://pod.test/container/new-thing#it
            </div>
            <input id="create" type="submit" value="Create" disabled />
          </form>
        </pos-new-thing-form>`,
    );
  });

  describe('submitting form', () => {
    describe('successfully', () => {
      let page;
      let os;
      let linkEventListener;

      beforeEach(async () => {
        // given
        page = await newSpecPage({
          components: [PosNewThingForm],
          html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
          supportsShadowDom: false,
        });

        os = mockPodOS();
        when(os.proposeUriForNewThing)
          .calledWith('https://pod.test/container/', 'New Thing')
          .mockReturnValue('https://pod.test/container/new-thing#it');
        await page.rootInstance.receivePodOs(os);

        // and the page listens for pod-os:link events
        linkEventListener = jest.fn();
        page.root.addEventListener('pod-os:link', linkEventListener);

        // when user selects a term and adds a name
        const termSelect = page.root.querySelector('pos-select-term');
        fireEvent(termSelect, new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/Thing' } }));

        const nameField = page.root.querySelector('input[type=text]');
        fireEvent.input(nameField, { target: { value: 'New Thing' } });

        await page.waitForChanges();

        // and submits the form
        const form: HTMLFormElement = page.root.querySelector('form');
        fireEvent.submit(form);
        await page.waitForChanges();
      });

      it('calls addNewThing', () => {
        expect(os.addNewThing).toHaveBeenCalledWith(
          'https://pod.test/container/new-thing#it',
          'New Thing',
          'https://schema.org/Thing',
        );
      });

      it('redirects to the new thing', () => {
        expect(linkEventListener).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: 'https://pod.test/container/new-thing#it',
          }),
        );
      });

      it('resets the form', async () => {
        expect(page.rootInstance.name).toBe('');
        expect(page.rootInstance.newUri).toBe('');
        expect(page.rootInstance.selectedTypeUri).toBe('');
      });
    });

    describe('with error', () => {
      let page;
      let os: Partial<PodOS>;
      let linkEventListener;
      let errorEventListener;

      beforeEach(async () => {
        // given
        page = await newSpecPage({
          components: [PosNewThingForm],
          html: `<pos-new-thing-form reference-uri="https://pod.test/container/"></pos-new-thing-form>`,
          supportsShadowDom: false,
        });

        os = mockPodOS() as unknown as PodOS;
        when(os.proposeUriForNewThing)
          .calledWith('https://pod.test/container/', 'New Thing')
          .mockReturnValue('https://pod.test/container/new-thing#it');
        when(os.addNewThing).mockRejectedValue(new Error('simulated error for test'));
        await page.rootInstance.receivePodOs(os);

        // and the page listens for pod-os:link events
        linkEventListener = jest.fn();
        page.root.addEventListener('pod-os:link', linkEventListener);

        // and the page listens for pod-os:error events
        errorEventListener = jest.fn();
        page.root.addEventListener('pod-os:error', errorEventListener);

        // when user selects a term and adds a name
        const termSelect = page.root.querySelector('pos-select-term');
        fireEvent(termSelect, new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/Thing' } }));

        const nameField = page.root.querySelector('input[type=text]');
        fireEvent.input(nameField, { target: { value: 'New Thing' } });

        await page.waitForChanges();

        // and submits the form
        const form: HTMLFormElement = page.root.querySelector('form');
        fireEvent.submit(form);
        await page.waitForChanges();
      });

      it('emits an error event', () => {
        expect(errorEventListener).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: new Error('simulated error for test'),
          }),
        );
      });

      it('does not redirect', () => {
        expect(linkEventListener).not.toHaveBeenCalled();
      });

      it('does not reset the form', () => {
        expect(page.rootInstance.name).toBe('New Thing');
        expect(page.rootInstance.newUri).toBe('https://pod.test/container/new-thing#it');
        expect(page.rootInstance.selectedTypeUri).toBe('https://schema.org/Thing');
      });
    });
  });
});
