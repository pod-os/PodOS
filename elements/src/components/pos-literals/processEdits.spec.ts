import { describe, expect, it } from 'vitest';
import { LiteralChanged, processEdits } from './processEdits';
import { mockPodOS } from '../../test/mockPodOS.vitest';
import { Observable, of } from 'rxjs';
import { Thing } from '@pod-os/core';

describe('process edits', () => {
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
});
