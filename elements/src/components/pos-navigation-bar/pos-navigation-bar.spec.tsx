import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { PosNavigationBar } from './pos-navigation-bar';

describe('pos-navigation-bar', () => {
  it('renders a search bar within a form', async () => {
    const page = await newSpecPage({
      components: [PosNavigationBar],
      html: `<pos-navigation-bar uri="https://pod.example/resource" />`,
    });
    expect(page.root).toEqualHtml(`
    <pos-navigation-bar uri="https://pod.example/resource">
      <mock:shadow-root>
        <form>
          <ion-searchbar enterkeyhint="search" placeholder="Enter URI" value="https://pod.example/resource"></ion-searchbar>
        </form>
      </mock:shadow-root>
    </pos-navigation-bar>`);
  });

  it('navigates to entered URI when form is submitted', async () => {
    // given a page with a navigation bar
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosNavigationBar],
      html: `<pos-navigation-bar uri="https://pod.example/resource" />`,
    });

    // and the page listens for pod-os:link events
    const linkEventListener = jest.fn();
    page.root.addEventListener('pod-os:link', linkEventListener);

    // when the user enters a URI into the searchbar
    const searchBar = page.root.querySelector('ion-searchbar');
    fireEvent(searchBar, new CustomEvent('ionChange', { detail: { value: 'https://resource.test/' } }));

    // and then submits the form
    const form = page.root.querySelector('form');
    fireEvent(form, new CustomEvent('submit', {}));

    // then a pod-os:link event with this URI is received in the listener
    expect(linkEventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'https://resource.test/',
      }),
    );
  });
});
