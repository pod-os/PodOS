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
    const resource = {} as Thing;

    // when a single edit processed
    const edits$: Observable<LiteralChanged> = of({
      predicate: 'http://schema.org/name',
      oldValue: 'Old Name',
      newValue: 'New Name',
    });
    edits$.pipe(processEdits(os, resource)).subscribe();

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
    const resource = {} as Thing;

    // when multiple edits are done quickly before the debounce time is reached
    const edits$: Subject<LiteralChanged> = new Subject();
    edits$.pipe(processEdits(os, resource)).subscribe();
    edits$.next({
      predicate: 'http://schema.org/name',
      oldValue: 'Old Name',
      newValue: 'Name 1',
    });
    vi.advanceTimersByTime(999);
    edits$.next({
      predicate: 'http://schema.org/name',
      oldValue: 'Old Name',
      newValue: 'Name 2',
    });
    vi.advanceTimersByTime(999);
    edits$.next({
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
});
