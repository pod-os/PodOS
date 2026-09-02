import { groupBy, mergeMap, Subject, tap } from 'rxjs';
import { PodOS, Thing } from '@pod-os/core';
import { debounceTime } from 'rxjs/operators';

export interface EditableLiteral {
  resource: Thing;
  predicate: string;
  label: string;
  values: EditableValue[];
}

export interface EditableValue {
  fieldId: string;
  value: string;
}

export interface Edit {
  fieldId: string;
  newValue: string;
}

export class LiteralEditor {
  private readonly edits: Subject<Edit> = new Subject<Edit>();

  constructor(os: PodOS, editableLiterals: EditableLiteral[]) {
    this.edits
      .pipe(
        groupBy(it => it.fieldId),
        mergeMap(group$ =>
          group$.pipe(
            debounceTime(1000),
            tap(async edit => {
              const field = editableLiterals
                .flatMap(literal =>
                  literal.values.map(value => ({
                    fieldId: value.fieldId,
                    resource: literal.resource,
                    predicate: literal.predicate,
                    value: value.value,
                  })),
                )
                .find(it => it.fieldId === edit.fieldId)!;
              await os.editPropertyValue(field.resource, field.predicate, field.value, edit.newValue);
            }),
          ),
        ),
      )
      .subscribe();
  }

  processEdit(edit: Edit) {
    this.edits.next(edit);
  }
}
