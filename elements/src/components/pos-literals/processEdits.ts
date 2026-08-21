import { OperatorFunction, tap } from 'rxjs';
import { PodOS, Thing } from '@pod-os/core';

export interface LiteralChanged {
  predicate: string;
  oldValue: string;
  newValue: string;
}

export function processEdits(os: PodOS, resource: Thing): OperatorFunction<LiteralChanged, any> {
  return edits$ => edits$.pipe(tap(it => os.editPropertyValue(resource, it.predicate, it.oldValue, it.newValue)));
}
