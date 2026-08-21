import { groupBy, mergeMap, OperatorFunction, tap } from 'rxjs';
import { PodOS, Thing } from '@pod-os/core';
import { debounceTime } from 'rxjs/operators';

export interface LiteralChanged {
  predicate: string;
  oldValue: string;
  newValue: string;
}

export function processEdits(os: PodOS, resource: Thing): OperatorFunction<LiteralChanged, any> {
  return edits$ =>
    edits$.pipe(
      groupBy(it => it.oldValue),
      mergeMap(group$ =>
        group$.pipe(
          debounceTime(1000),
          tap(it => os.editPropertyValue(resource, it.predicate, it.oldValue, it.newValue)),
        ),
      ),
    );
}
