import { OperatorFunction, tap } from 'rxjs';
import { PodOS, Thing } from '@pod-os/core';

export interface LiteralChanged {
  predicate: string;
  oldValue: string;
  newValue: string;
}

// @ts-expect-error TODO use variables
export function processEdits(os: PodOS, resource: Thing): OperatorFunction<LiteralChanged, any> {
  return edits$ => edits$.pipe(tap(it => console.log('TODO: process edit', it)));
}
