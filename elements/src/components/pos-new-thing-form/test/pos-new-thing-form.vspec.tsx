import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { PodOS } from '@pod-os/core';
import { fireEvent } from '@testing-library/dom';
import { when } from 'vitest-when';
import { mockPodOS } from '../../../test/mockPodOS.vitest';
import '../pos-new-thing-form';
import { withinShadow } from '../../../test/withinShadow';
import { userEvent } from '@testing-library/user-event';

describe('pos-new-thing-form', () => {
  it('renders a form', async () => {
    const page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);

    expect(page.root.shadowRoot).toEqualHtml(
      `
          <form method="dialog">
            <label for="type">
              Type
            </label>
            <pos-select-term id="type" placeholder></pos-select-term>
            <label for="name">
              Name
            </label>
            <input id="name" type="text">
            <input id="create" type="submit" value="Create" disabled>
          </form>`,
    );
  });

  describe('enabling and disabling the create button', () => {
    it('is disabled initially', async () => {
      const page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);
      const button: HTMLButtonElement = withinShadow(page).getByDisplayValue('Create');

      expect(button.disabled).toBe(true);
    });

    it('is still disabled after selecting a term', async () => {
      // given
      const page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);
      const button: HTMLButtonElement = withinShadow(page).getByDisplayValue('Create');

      // when user selects a term
      const termSelect = page.root.shadowRoot!.querySelector('pos-select-term')!;
      fireEvent(
        termSelect,
        new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
      );

      // then the button is enabled
      expect(button.disabled).toBe(true);
    });

    it('is still disabled after entering a name', async () => {
      // given
      const page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);

      const os = mockPodOS();
      await page.instance.receivePodOs(os);

      // when user fills in a name
      const nameField = page.root.shadowRoot!.querySelector('input[type=text]')!;
      fireEvent.input(nameField, { target: { value: 'New Thing' } });
      await page.waitForChanges();

      // then the button is disabled
      const button: HTMLButtonElement = withinShadow(page).getByDisplayValue('Create');
      expect(button.disabled).toBe(true);
    });

    it('is enabled after a term has been selected and a name typed', async () => {
      // given
      const page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);
      const os = mockPodOS();
      await page.instance.receivePodOs(os);

      // when user selects a term
      const termSelect = page.root.shadowRoot!.querySelector('pos-select-term')!;
      fireEvent(
        termSelect,
        new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
      );

      // and fills in a name
      const nameField = page.root.shadowRoot!.querySelector('input[type=text]')!;
      fireEvent.input(nameField, { target: { value: 'New Thing' } });
      await page.waitForChanges();

      // then the button is enabled
      const button: HTMLButtonElement = withinShadow(page).getByDisplayValue('Create');
      expect(button.disabled).toBe(false);
    });

    it('is enabled when name is typed and then a term is selected', async () => {
      // given
      const page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);
      const os = mockPodOS();
      await page.instance.receivePodOs(os);

      // when user fills in a name
      const nameField = page.root.shadowRoot!.querySelector('input[type=text]')!;
      fireEvent.input(nameField, { target: { value: 'New Thing' } });

      // and after that selects a term
      const termSelect = page.root.shadowRoot!.querySelector('pos-select-term')!;
      fireEvent(
        termSelect,
        new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/description' } }),
      );
      await page.waitForChanges();

      // then the button is enabled
      const button: HTMLButtonElement = withinShadow(page).getByDisplayValue('Create');
      expect(button.disabled).toBe(false);
    });
  });

  it('shows the URI of the new thing after typing a name', async () => {
    const page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);

    const os = mockPodOS();
    when(os.proposeUriForNewThing)
      .calledWith('https://pod.test/container/', 'New Thing')
      .thenReturn('https://pod.test/container/new-thing#it');
    await page.instance.receivePodOs(os);

    const nameField = page.root.shadowRoot!.querySelector('input[type=text]')!;
    await userEvent.type(nameField, 'New Thing');
    // fireEvent.input(nameField, { target: { value: 'New Thing' } });

    await page.waitForChanges();

    expect(os.proposeUriForNewThing).toHaveBeenCalledWith('https://pod.test/container/', 'New Thing');

    expect(page.root.shadowRoot).toEqualHtml(
      `
          <form method="dialog">
            <label for="type">
              Type
            </label>
            <pos-select-term id="type" placeholder></pos-select-term>
            <label for="name">
              Name
            </label>
            <input id="name" type="text">
            <div id="new-uri" title="This will be the URI of the new thing">
              https://pod.test/container/new-thing#it
            </div>
            <input id="create" type="submit" value="Create" disabled>
          </form>`,
    );
  });

  describe('submitting form', () => {
    describe('successfully', () => {
      let page: RenderResult;
      let os: PodOS;
      let linkEventListener: Mock;

      beforeEach(async () => {
        // given
        page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);

        os = mockPodOS();
        when(os.proposeUriForNewThing)
          .calledWith('https://pod.test/container/', 'New Thing')
          .thenReturn('https://pod.test/container/new-thing#it');
        await page.instance.receivePodOs(os);

        // and the page listens for pod-os:link events
        linkEventListener = vi.fn();
        page.root.addEventListener('pod-os:link', linkEventListener);

        // when user selects a term and adds a name
        const termSelect = page.root.shadowRoot!.querySelector('pos-select-term')!;
        fireEvent(termSelect, new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/Thing' } }));

        const nameField = page.root.shadowRoot!.querySelector('input[type=text]')!;
        fireEvent.input(nameField, { target: { value: 'New Thing' } });

        await page.waitForChanges();

        // and submits the form
        const form: HTMLFormElement = page.root.shadowRoot!.querySelector('form')!;
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
        expect(page.instance.name).toBe('');
        expect(page.instance.newUri).toBe('');
        expect(page.instance.selectedTypeUri).toBe('');
      });
    });

    describe('with error', () => {
      let page: RenderResult;
      let os: Partial<PodOS>;
      let linkEventListener: Mock;
      let errorEventListener: Mock;

      beforeEach(async () => {
        // given
        page = await render(<pos-new-thing-form referenceUri="https://pod.test/container/"></pos-new-thing-form>);

        os = mockPodOS() as unknown as PodOS;
        when(os.proposeUriForNewThing as Mock)
          .calledWith('https://pod.test/container/', 'New Thing')
          .thenReturn('https://pod.test/container/new-thing#it');
        (os.addNewThing as Mock).mockRejectedValue(new Error('simulated error for test'));
        await page.instance.receivePodOs(os);

        // and the page listens for pod-os:link events
        linkEventListener = vi.fn();
        page.root.addEventListener('pod-os:link', linkEventListener);

        // and the page listens for pod-os:error events
        errorEventListener = vi.fn();
        page.root.addEventListener('pod-os:error', errorEventListener);

        // when user selects a term and adds a name
        const termSelect = page.root.shadowRoot!.querySelector('pos-select-term')!;
        fireEvent(termSelect, new CustomEvent('pod-os:term-selected', { detail: { uri: 'https://schema.org/Thing' } }));

        const nameField = page.root.shadowRoot!.querySelector('input[type=text]')!;
        fireEvent.input(nameField, { target: { value: 'New Thing' } });

        await page.waitForChanges();

        // and submits the form
        const form: HTMLFormElement = page.root.shadowRoot!.querySelector('form')!;
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
        expect(page.instance.name).toBe('New Thing');
        expect(page.instance.newUri).toBe('https://pod.test/container/new-thing#it');
        expect(page.instance.selectedTypeUri).toBe('https://schema.org/Thing');
      });
    });
  });
});
