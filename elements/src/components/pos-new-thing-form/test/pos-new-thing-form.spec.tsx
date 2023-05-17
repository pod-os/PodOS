import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
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
            <input type="submit" value="Create" />
          </form>
        </pos-new-thing-form>`,
    );
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
            <input type="submit" value="Create" />
          </form>
        </pos-new-thing-form>`,
    );
  });
});
