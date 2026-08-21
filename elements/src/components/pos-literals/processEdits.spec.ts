import { afterEach, describe, expect, it, vi } from 'vitest';
import { LiteralChanged, processEdits } from './processEdits';
import { mockPodOS } from '../../test/mockPodOS.vitest';
import { Observable, of, Subject } from 'rxjs';
import { Thing } from '@pod-os/core';
import { beforeEach } from '@stencil/vitest';

describe('process edits', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it('processes a single edit', () => {
    // given os and resource
    const os = mockPodOS();
    const resource = { uri: 'https://pod.test/resource' } as Thing;
    // when a single edit processed
    const edits$: Observable<LiteralChanged> = of({
      resource,
      predicate: 'http://schema.org/name',
      oldValue: 'Old Name',
      newValue: 'New Name',
    });
    edits$.pipe(processEdits(os)).subscribe();

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

    // when multiple edits are done quickly before the debounce time is reached
    const edits$: Subject<LiteralChanged> = new Subject();
    edits$.pipe(processEdits(os)).subscribe();
    edits$.next({
      resource,
      predicate: 'http://schema.org/name',
      oldValue: 'Old Name',
      newValue: 'Name 1',
    });
    vi.advanceTimersByTime(999);
    edits$.next({
      resource,
      predicate: 'http://schema.org/name',
      oldValue: 'Old Name',
      newValue: 'Name 2',
    });
    vi.advanceTimersByTime(999);
    edits$.next({
      resource,
      predicate: 'http://schema.org/name',
      oldValue: 'Old Name',
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

    // when multiple edits are done quickly to two different values of the same predicated
    const edits$: Subject<LiteralChanged> = new Subject();
    edits$.pipe(processEdits(os)).subscribe();
    edits$.next({
      resource,
      predicate: 'http://schema.org/name',
      oldValue: 'Value A',
      newValue: 'New Value A',
    });
    vi.advanceTimersByTime(999);
    edits$.next({
      resource,
      predicate: 'http://schema.org/name',
      oldValue: 'Value B',
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

    // when multiple edits are done quickly to two different predicates with the same value
    const edits$: Subject<LiteralChanged> = new Subject();
    edits$.pipe(processEdits(os)).subscribe();
    edits$.next({
      resource,
      predicate: 'http://schema.org/name',
      oldValue: 'Old Value',
      newValue: 'New Name',
    });
    vi.advanceTimersByTime(999);
    edits$.next({
      resource,
      predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
      oldValue: 'Old Value',
      newValue: 'New Label',
    });
    vi.advanceTimersByTime(999);

    // then the os only updated the first value because it has not been changed for over a second
    expect(os.editPropertyValue).toHaveBeenCalledExactlyOnceWith(
      resource,
      'http://schema.org/name',
      'Old Value',
      'New Name',
    );

    // and when the debounce-threshold is reached for the second value
    vi.advanceTimersByTime(1);

    // then the os updates that one as well
    expect(os.editPropertyValue).toHaveBeenCalledTimes(2);
    expect(os.editPropertyValue).toHaveBeenCalledWith(
      resource,
      'http://www.w3.org/2000/01/rdf-schema#label',
      'Old Value',
      'New Label',
    );
  });

  it('processes edits to the same value on separate resources independently', () => {
    // given os and two resources
    const os = mockPodOS();
    const first = { uri: 'https://pod.test/first' } as Thing;
    const second = { uri: 'https://pod.test/second' } as Thing;

    // when the same value is edited on the first resource, and then (e.g. after navigation) on the second
    const edits$: Subject<LiteralChanged> = new Subject();
    edits$.pipe(processEdits(os)).subscribe();
    edits$.next({
      resource: first,
      predicate: 'http://schema.org/name',
      oldValue: 'Name',
      newValue: 'New Name on first',
    });
    vi.advanceTimersByTime(999);
    edits$.next({
      resource: second,
      predicate: 'http://schema.org/name',
      oldValue: 'Name',
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
});
