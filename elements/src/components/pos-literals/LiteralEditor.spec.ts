import { afterEach, describe, expect, it, Mock, vi } from 'vitest';
import { LiteralEditor, FieldState } from './LiteralEditor';
import { mockPodOS } from '../../test/mockPodOS.vitest';
import { Thing } from '@pod-os/core';
import { beforeEach } from '@stencil/vitest';

describe('Literal Editor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('processes edits', () => {
    it('processes a single edit', () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor for a field
      const editor = new LiteralEditor(os, [
        {
          resource,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '123', value: 'Old Name' }],
        },
      ]);

      // when a single edit processed
      editor.processEdit({
        fieldId: '123',
        newValue: 'New Name',
      });
      vi.advanceTimersByTime(1000);

      // then the os updates the property value once
      expect(os.editPropertyValue).toHaveBeenCalledExactlyOnceWith(
        resource,
        'http://schema.org/name',
        'Old Name',
        'New Name',
      );
    });

    it('processes multiple edits with a debounce', () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor for a field
      const editor = new LiteralEditor(os, [
        {
          resource,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '123', value: 'Old Name' }],
        },
      ]);

      // when multiple edits are done quickly before the debounce time is reached
      editor.processEdit({
        fieldId: '123',
        newValue: 'Name 1',
      });
      vi.advanceTimersByTime(999);
      editor.processEdit({
        fieldId: '123',
        newValue: 'Name 2',
      });
      vi.advanceTimersByTime(999);
      editor.processEdit({
        fieldId: '123',
        newValue: 'Name 3',
      });
      vi.advanceTimersByTime(999);

      // then the os does not update anything yet
      expect(os.editPropertyValue).not.toHaveBeenCalled();

      // but when the debounce-threshold is reached
      vi.advanceTimersByTime(1);

      // then the os updates the property value once with the latest change
      expect(os.editPropertyValue).toHaveBeenCalledExactlyOnceWith(
        resource,
        'http://schema.org/name',
        'Old Name',
        'Name 3',
      );
    });

    it('processes edits to separate values independently', () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor with two fields for the same predicate
      const editor = new LiteralEditor(os, [
        {
          resource,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [
            { fieldId: '1', value: 'Value A' },
            { fieldId: '2', value: 'Value B' },
          ],
        },
      ]);
      // when multiple edits are done quickly to two different values of the same predicated
      editor.processEdit({
        fieldId: '1',
        newValue: 'New Value A',
      });
      vi.advanceTimersByTime(999);
      editor.processEdit({
        fieldId: '2',
        newValue: 'New Value B',
      });
      vi.advanceTimersByTime(999);

      // then the os only updated the first value because it has not been changed for over a second
      expect(os.editPropertyValue).toHaveBeenCalledExactlyOnceWith(
        resource,
        'http://schema.org/name',
        'Value A',
        'New Value A',
      );

      // and when the debounce-threshold is reached for the second value
      vi.advanceTimersByTime(1);

      // then the os updates that one as well
      expect(os.editPropertyValue).toHaveBeenCalledTimes(2);
      expect(os.editPropertyValue).toHaveBeenCalledWith(resource, 'http://schema.org/name', 'Value B', 'New Value B');
    });

    it('processes edits to separate predicates independently', () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor with two fields for different predicates
      const editor = new LiteralEditor(os, [
        {
          resource,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '1', value: 'Old Name' }],
        },
        {
          resource,
          predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
          label: 'irrelevant',
          values: [{ fieldId: '2', value: 'Old Label' }],
        },
      ]);

      // when multiple edits are done quickly to two different predicates with the same value
      editor.processEdit({
        fieldId: '1',
        newValue: 'New Name',
      });
      vi.advanceTimersByTime(999);
      editor.processEdit({
        fieldId: '2',
        newValue: 'New Label',
      });
      vi.advanceTimersByTime(999);

      // then the os only updated the first value because it has not been changed for over a second
      expect(os.editPropertyValue).toHaveBeenCalledExactlyOnceWith(
        resource,
        'http://schema.org/name',
        'Old Name',
        'New Name',
      );

      // and when the debounce-threshold is reached for the second value
      vi.advanceTimersByTime(1);

      // then the os updates that one as well
      expect(os.editPropertyValue).toHaveBeenCalledTimes(2);
      expect(os.editPropertyValue).toHaveBeenCalledWith(
        resource,
        'http://www.w3.org/2000/01/rdf-schema#label',
        'Old Label',
        'New Label',
      );
    });

    it('processes edits to the same value on separate resources independently', () => {
      // given os and two resources
      const os = mockPodOS();
      const first = { uri: 'https://pod.test/first' } as Thing;
      const second = { uri: 'https://pod.test/second' } as Thing;

      // and a literal editor with two fields for different resources
      const editor = new LiteralEditor(os, [
        {
          resource: first,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '1', value: 'Name' }],
        },
        {
          resource: second,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '2', value: 'Name' }],
        },
      ]);

      // when the same value is edited on the first resource, and then (e.g. after navigation) on the second
      editor.processEdit({
        fieldId: '1',
        newValue: 'New Name on first',
      });
      vi.advanceTimersByTime(999);
      editor.processEdit({
        fieldId: '2',
        newValue: 'New Name on second',
      });
      vi.advanceTimersByTime(999);

      // then the os only updated the first resource because it has not been changed for over a second
      expect(os.editPropertyValue).toHaveBeenCalledExactlyOnceWith(
        first,
        'http://schema.org/name',
        'Name',
        'New Name on first',
      );

      // and when the debounce-threshold is reached for the second resource
      vi.advanceTimersByTime(1);

      // then both resources are updated independently
      expect(os.editPropertyValue).toHaveBeenCalledTimes(2);
      expect(os.editPropertyValue).toHaveBeenCalledWith(second, 'http://schema.org/name', 'Name', 'New Name on second');
    });

    it('processes two subsequent edits with the updated old value', async () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor for a field
      const editor = new LiteralEditor(os, [
        {
          resource,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '1', value: 'Old Value' }],
        },
      ]);
      // when a value is edited
      editor.processEdit({
        fieldId: '1',
        newValue: 'First edit',
      });
      await vi.advanceTimersByTimeAsync(1000);

      // and the os already edited the property value
      expect(os.editPropertyValue).toHaveBeenCalledExactlyOnceWith(
        resource,
        'http://schema.org/name',
        'Old Value',
        'First edit',
      );

      // when a second edit is done for the same original old value
      editor.processEdit({
        fieldId: '1',
        newValue: 'Second edit',
      });
      await vi.advanceTimersByTimeAsync(1000);

      // then the os updates that one as well, but uses the latest value as old value
      expect(os.editPropertyValue).toHaveBeenCalledTimes(2);
      expect(os.editPropertyValue).toHaveBeenCalledWith(
        resource,
        'http://schema.org/name',
        'First edit',
        'Second edit',
      );
    });
  });

  describe('register fields', () => {
    it('processes a single edit to a newly registered field', () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor without fields
      const editor = new LiteralEditor(os, []);

      // but a field is registered afterwards
      editor.registerFields({
        resource,
        predicate: 'http://schema.org/name',
        label: 'irrelevant',
        values: [{ fieldId: '123', value: 'Old Name' }],
      });

      // when a single edit processed for that field
      editor.processEdit({
        fieldId: '123',
        newValue: 'New Name',
      });
      vi.advanceTimersByTime(1000);

      // then the os updates the property value once
      expect(os.editPropertyValue).toHaveBeenCalledExactlyOnceWith(
        resource,
        'http://schema.org/name',
        'Old Name',
        'New Name',
      );
    });

    it('ignores duplicate fields', () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor for a field
      const editor = new LiteralEditor(os, [
        {
          resource,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '1', value: 'Old Value 1' }],
        },
      ]);

      // and an editable literal is registered with one new field and one pre-existing
      editor.registerFields({
        resource,
        predicate: 'http://schema.org/name',
        label: 'irrelevant',
        values: [
          { fieldId: '1', value: 'Old Value 1' },
          { fieldId: '2', value: 'Old Value 2' },
        ],
      });

      // when both fields are edited
      editor.processEdit({
        fieldId: '1',
        newValue: 'New Value 1',
      });
      editor.processEdit({
        fieldId: '2',
        newValue: 'New Value 2',
      });
      vi.advanceTimersByTime(1000);

      // then the os updates both values once
      expect(os.editPropertyValue).toHaveBeenCalledTimes(2);
      expect(os.editPropertyValue).toHaveBeenCalledWith(
        resource,
        'http://schema.org/name',
        'Old Value 1',
        'New Value 1',
      );
      expect(os.editPropertyValue).toHaveBeenCalledWith(
        resource,
        'http://schema.org/name',
        'Old Value 2',
        'New Value 2',
      );
    });
  });

  describe('tracks the states', () => {
    it('tracks the state of a single edit', async () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor for a field
      const editor = new LiteralEditor(os, [
        {
          resource,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '123', value: 'Old Name' }],
        },
      ]);

      // and editor states are tracked
      const stateChanges: FieldState[] = [];
      editor.states$.subscribe(state => {
        stateChanges.push(state);
      });

      // when a single edit processed
      editor.processEdit({
        fieldId: '123',
        newValue: 'New Name',
      });

      // then the field gets touched
      expect(stateChanges[0]).toEqual({
        fieldId: '123',
        status: 'touched',
        message: 'User is typing',
      });

      // when the debounce time passed
      await vi.advanceTimersByTimeAsync(1000);

      // then the state changes to pending
      expect(stateChanges[1]).toEqual({
        fieldId: '123',
        status: 'pending',
        message: 'Data is being saved',
      });

      // and finally to success
      await vi.advanceTimersByTimeAsync(1);
      expect(stateChanges[2]).toEqual({
        fieldId: '123',
        status: 'success',
        message: 'Saved successfully',
      });
    });

    it('error state is published if saving failed', async () => {
      // given os and resource
      const os = mockPodOS();
      const resource = { uri: 'https://pod.test/resource' } as Thing;

      // and a literal editor for a field
      const editor = new LiteralEditor(os, [
        {
          resource,
          predicate: 'http://schema.org/name',
          label: 'irrelevant',
          values: [{ fieldId: '123', value: 'Old Name' }],
        },
      ]);

      // and editor states are tracked
      const stateChanges: FieldState[] = [];
      editor.states$.subscribe(state => {
        stateChanges.push(state);
      });

      // and saving will fail
      (os.editPropertyValue as Mock).mockImplementation(() => {
        throw new Error('Failed to save');
      });

      // when a single edit is processed
      editor.processEdit({
        fieldId: '123',
        newValue: 'New Name',
      });

      // then the field gets touched
      expect(stateChanges[0]).toEqual({
        fieldId: '123',
        status: 'touched',
        message: 'User is typing',
      });

      // when the debounce time passed
      await vi.advanceTimersByTimeAsync(1000);

      // then the state changes to pending
      expect(stateChanges[1]).toEqual({
        fieldId: '123',
        status: 'pending',
        message: 'Data is being saved',
      });

      // and finally to error
      await vi.advanceTimersByTimeAsync(1);
      expect(stateChanges[2]).toEqual({
        fieldId: '123',
        status: 'error',
        message: 'Failed to save',
      });
    });
  });
});
