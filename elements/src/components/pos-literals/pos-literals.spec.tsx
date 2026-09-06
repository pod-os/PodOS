import { mockPodOS } from '../../test/mockPodOS.vitest';

import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';

import { fireEvent, getByRole, getByText, waitFor } from '@testing-library/dom';
import './pos-literals';
import { Literal, Thing } from '@pod-os/core';
import { mockResource } from '../../test/mockResource';
import { withinShadow } from '../../test/withinShadow';
import { getByShadowRole } from 'shadow-dom-testing-library';
import { userEvent } from '@testing-library/user-event';
import { EditableLiteral, FieldState, LiteralEditor } from './LiteralEditor';
import { EMPTY, Subject } from 'rxjs';

vi.mock('./LiteralEditor', () => ({ LiteralEditor: vi.fn() }));

describe('pos-literals', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (LiteralEditor as any).mockImplementation(
      class {
        states$ = EMPTY;
      },
    );
  });

  it('are empty initially, but include option to add one', async () => {
    const page = await render(<pos-literals></pos-literals>);
    expect(page.root.shadowRoot).toEqualHtml('<pos-add-literal-value></pos-add-literal-value>');
  });

  describe('render literal values', () => {
    it('renders single predicate and value', async () => {
      mockResource({
        literals: () => [
          {
            predicate: 'http://schema.org/name',
            label: 'name',
            values: ['Alice'],
          },
        ],
      });
      const page = await render(<pos-literals></pos-literals>);
      await page.waitForChanges();

      const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

      expect(getByRole(el, 'definition')).toEqualText('Alice');
      const term = getByRole(el, 'term');
      const predicate = term.querySelector('pos-predicate');
      expect(predicate).toEqualHtml('<pos-predicate uri="http://schema.org/name" label="name"></pos-predicate>');
    });

    it('renders multiple predicates and values', async () => {
      mockResource({
        literals: () => [
          {
            predicate: 'http://schema.org/name',
            label: 'name',
            values: ['Alice', 'Bernadette'],
          },
          {
            predicate: 'http://schema.org/description',
            label: 'description',
            values: ['the description'],
          },
        ],
      });
      const page = await render(<pos-literals></pos-literals>);
      await page.waitForChanges();

      const el: HTMLElement = page.root.shadowRoot as unknown as HTMLElement;

      expect(getByText(el, 'Alice')).toBeDefined();
      expect(getByText(el, 'Bernadette')).toBeDefined();
      const name = el.querySelector('pos-predicate[uri="http://schema.org/name"]');
      expect(name).toEqualAttribute('label', 'name');

      expect(getByText(el, 'the description')).toBeDefined();
      const description = el.querySelector('pos-predicate[uri="http://schema.org/description"]');
      expect(description).toEqualAttribute('label', 'description');
    });
  });

  describe('add a new literal value', () => {
    it('adds newly added predicate to the list', async () => {
      // given a thing without literals
      const resource = {
        literals: () => [],
      } as unknown as Thing;
      mockResource(resource);

      // and a literal editor
      const registerFields = vi.fn();
      (LiteralEditor as any).mockImplementation(
        class {
          states$ = EMPTY;
          registerFields = registerFields;
        },
      );

      // and a page rendering pos-literals
      const page = await render(<pos-literals></pos-literals>);
      await page.waitForChanges();

      // when a new literal is added
      const input = page.root.shadowRoot!.querySelector('pos-add-literal-value')!;
      const literal: Literal = {
        predicate: 'https://schema.org/name',
        label: 'name',
        values: ['Alice'],
      };
      fireEvent(
        input,
        new CustomEvent('pod-os:added-literal-value', {
          detail: literal,
        }),
      );

      await page.waitForChanges();

      // then it shows up
      expect(withinShadow(page).getByText('Alice')).toBeDefined();
      const name = page.root.shadowRoot!.querySelector('pos-predicate[uri="https://schema.org/name"]');
      expect(name).toEqualAttribute('label', 'name');

      // and a field is registered in the editor
      const field: EditableLiteral = {
        label: 'name',
        predicate: 'https://schema.org/name',
        resource,
        values: [
          {
            fieldId: expect.anything(),
            value: 'Alice',
          },
        ],
      };
      expect(registerFields).toHaveBeenCalledExactlyOnceWith(field);
    });

    it('adds newly added predicate value to the existing list without duplicating the predicate', async () => {
      // given a resource with a name
      const resource = {
        literals: () => [
          {
            predicate: 'https://schema.org/name',
            label: 'name',
            values: ['Alice'],
          },
        ],
      } as unknown as Thing;
      mockResource(resource);

      // and a literal editor
      const registerFields = vi.fn();
      (LiteralEditor as any).mockImplementation(
        class {
          states$ = EMPTY;
          registerFields = registerFields;
        },
      );

      // and a page rendering pos-literals
      const page = await render(<pos-literals></pos-literals>);
      await page.waitForChanges();

      // when another value for the name property is added
      const input = page.root.shadowRoot!.querySelector('pos-add-literal-value')!;
      const literal: Literal = {
        predicate: 'https://schema.org/name',
        label: 'name',
        values: ['Bernadette'],
      };
      fireEvent(
        input,
        new CustomEvent('pod-os:added-literal-value', {
          detail: literal,
        }),
      );

      await page.waitForChanges();

      // then both names show up
      expect(withinShadow(page).getByText('Alice')).toBeDefined();
      expect(withinShadow(page).getByText('Bernadette')).toBeDefined();
      const name = page.root.shadowRoot!.querySelectorAll('pos-predicate[uri="https://schema.org/name"]');
      expect(name).toHaveLength(1);

      // and a new field is added to the literal editor
      const field: EditableLiteral = {
        label: 'name',
        predicate: 'https://schema.org/name',
        resource,
        values: [
          {
            fieldId: expect.anything(),
            value: 'Bernadette',
          },
        ],
      };
      expect(registerFields).toHaveBeenCalledExactlyOnceWith(field);
    });
  });

  describe('edit values', () => {
    it('the content is not editable if resource is not editable', async () => {
      // given a resource is not editable
      mockResource({
        editable: false,
        literals: () => [
          {
            predicate: 'http://schema.org/name',
            label: 'name',
            values: ['Alice'],
          },
        ],
      });

      // when pos-literals render
      const page = await render(<pos-literals></pos-literals>);
      await page.waitForChanges();

      // then the content is not editable
      const value = getByShadowRole(page.root, 'definition');
      expect(value).toMatchInlineSnapshot(`
        <dd>
          <div
            contenteditable="false"
          >
            Alice
          </div>
        </dd>
      `);
    });

    it('the content is editable if resource is editable', async () => {
      // given a resource is editable
      mockResource({
        editable: true,
        literals: () => [
          {
            predicate: 'http://schema.org/name',
            label: 'name',
            values: ['Alice'],
          },
        ],
      });

      // when pos-literals render
      const page = await render(<pos-literals></pos-literals>);
      await page.waitForChanges();

      // then the content is editable
      const value = getByShadowRole(page.root, 'definition');
      expect(value).toMatchInlineSnapshot(`
        <dd>
          <div
            contenteditable="plaintext-only"
            role="textbox"
          >
            Alice
          </div>
        </dd>
      `);
    });

    it('processes edits of a literal value', async () => {
      // given a resource is editable
      mockPodOS();
      const resource = {
        editable: true,
        literals: () => [
          {
            predicate: 'http://schema.org/name',
            label: 'name',
            values: ['Alice'],
          },
        ],
      } as Thing;
      mockResource(resource);

      // and edits can be processed
      const processEdit = vi.fn();
      (LiteralEditor as any).mockImplementation(
        class {
          states$ = EMPTY;
          processEdit = processEdit;
        },
      );

      // and a pos-literals element is present
      const page = await render(<pos-literals></pos-literals>);

      // when the user changes the literal value
      const value = getByShadowRole(page.root, 'textbox');
      await editContent(value, '{Control>}a{/Control}{Backspace}Bob');

      // then the dom value is updated
      expect(value.textContent).toBe('Bob');

      // and the edit is processed as a stream
      expect(processEdit).toHaveBeenCalledTimes(4);
      expect(processEdit).toHaveBeenCalledWith({
        fieldId: expect.anything(),
        newValue: '',
      });
      expect(processEdit).toHaveBeenCalledWith({
        fieldId: expect.anything(),
        newValue: 'B',
      });
      expect(processEdit).toHaveBeenCalledWith({
        fieldId: expect.anything(),
        newValue: 'Bo',
      });
      expect(processEdit).toHaveBeenCalledWith({
        fieldId: expect.anything(),
        newValue: 'Bob',
      });
    });

    it('processes edits to a newly added literal value', async () => {
      // given a resource is editable but does not have literals yet
      mockPodOS();
      const resource = {
        editable: true,
        literals: () => [] as Literal[],
      } as Thing;
      mockResource(resource);

      // and edits can be processed
      const processEdit = vi.fn();
      const registerFields = vi.fn();
      (LiteralEditor as any).mockImplementation(
        class {
          states$ = EMPTY;
          processEdit = processEdit;
          registerFields = registerFields;
        },
      );

      // and a pos-literals element is present
      const page = await render(<pos-literals></pos-literals>);

      // when the user adds a literal value
      const input = page.root.shadowRoot!.querySelector('pos-add-literal-value')!;
      const literal: Literal = {
        predicate: 'https://schema.org/name',
        label: 'name',
        values: ['Alice'],
      };
      fireEvent(
        input,
        new CustomEvent('pod-os:added-literal-value', {
          detail: literal,
        }),
      );

      await page.waitForChanges();
      const textbox = getByShadowRole(page.root, 'textbox');
      expect(textbox).toHaveTextContent('Alice');

      // and a new field is registered in the editor
      const field: EditableLiteral = {
        label: 'name',
        predicate: 'https://schema.org/name',
        resource,
        values: [
          {
            fieldId: expect.anything(),
            value: 'Alice',
          },
        ],
      };
      expect(registerFields).toHaveBeenCalledExactlyOnceWith(field);
      const fieldId = (registerFields as Mock).mock.calls[0][0].values[0].fieldId;

      // when the user edits the new field
      const value = getByShadowRole(page.root, 'textbox');
      await editContent(value, '{Control>}a{/Control}{Backspace}Bob');

      // then the entered value is shown
      expect(textbox).toHaveTextContent('Bob');

      // and the edit is processed with the newly registered field's ID
      expect(processEdit).toHaveBeenCalledWith({
        fieldId,
        newValue: 'Bob',
      });
    });

    it.each(['touched', 'pending', 'success', 'error'])(
      'shows the %s status from literal editor',
      async (status: string) => {
        // given a resource is editable
        mockPodOS();
        const resource = {
          editable: true,
          literals: () => [
            {
              predicate: 'http://schema.org/name',
              label: 'name',
              values: ['Alice'],
            },
          ],
        } as Thing;
        mockResource(resource);

        // and edits can be processed
        const states$ = new Subject<FieldState>();
        const processEdit = vi.fn();
        (LiteralEditor as any).mockImplementation(
          class {
            states$ = states$;
            processEdit = processEdit;
          },
        );

        // and a pos-literals element is present
        const page = await render(<pos-literals></pos-literals>);

        // then the state is first neutral
        const textbox = getByShadowRole(page.root, 'textbox');
        expect(textbox).not.toHaveClass('touched');

        const fieldId = page.instance.data[0].values[0].fieldId;

        // when fields states changes
        // @ts-ignore
        states$.next({ fieldId, message: 'Something happened', status });

        // then a CSS class is added to visualize the state
        await waitFor(() => {
          expect(textbox).toHaveClass(status);
        });
      },
    );

    it('emits the error if literal editor publishes one', async () => {
      // given a resource is editable
      mockPodOS();
      const resource = {
        editable: true,
        literals: () => [
          {
            predicate: 'http://schema.org/name',
            label: 'name',
            values: ['Alice'],
          },
        ],
      } as Thing;
      mockResource(resource);

      // and edits can be processed
      const states$ = new Subject<FieldState>();
      const processEdit = vi.fn();
      (LiteralEditor as any).mockImplementation(
        class {
          states$ = states$;
          processEdit = processEdit;
        },
      );

      // and a pos-literals element is present
      const page = await render(<pos-literals></pos-literals>);

      // and error events are subscribed
      const errorListener = vi.fn();
      page.root.addEventListener('pod-os:error', errorListener);

      // when the editor emits some events and finally an error
      states$.next({
        fieldId: '123',
        message: 'Something else happened',
        status: 'pending',
      });
      states$.next({
        fieldId: '123',
        message: 'Something when wrong',
        status: 'error',
      });

      // then the error event is emitted
      expect(errorListener).toHaveBeenCalledOnce();
      expect(errorListener).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: new Error('Something when wrong') }),
      );
    });
  });
});

async function editContent(value: HTMLElement, text: string) {
  // happy-dom + user-event only support contenteditable="true", not "plaintext-only", so set "true" for the interaction
  expect(value).toEqualAttribute('contenteditable', 'plaintext-only');
  (value as HTMLElement).setAttribute('contenteditable', 'true');
  await userEvent.click(value);
  await userEvent.keyboard(text);
}
