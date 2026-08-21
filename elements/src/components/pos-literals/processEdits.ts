import { groupBy, mergeMap, OperatorFunction, tap } from 'rxjs';
import { PodOS, Thing } from '@pod-os/core';
import { debounceTime } from 'rxjs/operators';

export interface LiteralChanged {
  resource: Thing;
  predicate: string;
  oldValue: string;
  newValue: string;
}

export function processEdits(os: PodOS): OperatorFunction<LiteralChanged, any> {
  return edits$ =>
    edits$.pipe(
      groupBy(it => `${it.resource.uri}|${it.predicate}|${it.oldValue}`),
      mergeMap(group$ =>
        group$.pipe(
          debounceTime(1000),
          tap(it => os.editPropertyValue(it.resource, it.predicate, it.oldValue, it.newValue)),
        ),
      ),
    );
}
