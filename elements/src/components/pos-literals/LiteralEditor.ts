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

export interface FieldState {
  fieldId: string;
  status: 'touched' | 'pending' | 'success' | 'error';
  message: string;
}

interface EditorField {
  fieldId: string;
  resource: Thing;
  predicate: string;
  value: string;
}

/**
 * Processes a stream of edits to literal values and sends them to the PodOS core debounced
 */
export class LiteralEditor {
  private readonly edits: Subject<Edit> = new Subject<Edit>();

  private readonly fields: EditorField[] = [];

  private lastKnownValue: { [fieldId: string]: string } = {};

  readonly states$ = new Subject<FieldState>();

  constructor(os: PodOS, editableLiterals: EditableLiteral[]) {
    this.fields = editableLiterals.flatMap(literal =>
      literal.values.map(value => ({
        fieldId: value.fieldId,
        resource: literal.resource,
        predicate: literal.predicate,
        value: value.value,
      })),
    );
    this.edits
      .pipe(
        groupBy(it => it.fieldId),
        mergeMap(group$ =>
          group$.pipe(
            tap(edit => {
              this.states$.next({ fieldId: edit.fieldId, status: 'touched', message: 'User is typing' });
            }),
            debounceTime(1000),
            tap(async edit => {
              const field = this.fields.find(it => it.fieldId === edit.fieldId)!;
              const value = this.lastKnownValue[edit.fieldId] ?? field.value;
              this.states$.next({ fieldId: edit.fieldId, status: 'pending', message: 'Data is being saved' });
              try {
                await os.editPropertyValue(field.resource, field.predicate, value, edit.newValue);
                this.states$.next({ fieldId: edit.fieldId, status: 'success', message: 'Saved successfully' });
                this.lastKnownValue[edit.fieldId] = edit.newValue;
              } catch (error) {
                this.states$.next({ fieldId: edit.fieldId, status: 'error', message: (error as Error).message });
              }
            }),
          ),
        ),
      )
      .subscribe();
  }

  registerFields(literal: EditableLiteral) {
    this.fields.push(
      ...literal.values.map(value => ({
        fieldId: value.fieldId,
        resource: literal.resource,
        predicate: literal.predicate,
        value: value.value,
      })),
    );
  }

  processEdit(edit: Edit) {
    this.edits.next(edit);
  }
}
