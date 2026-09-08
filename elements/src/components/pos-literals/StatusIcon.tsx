import { h } from '@stencil/core';
import { EditableValue, FieldState } from './LiteralEditor';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

export function StatusIcon({ state, field }: { state: FieldState; field: EditableValue }) {
  return state ? (
    <sl-tooltip content={state?.message}>
      <span
        id={`${field.fieldId}-status`}
        role="status"
        aria-live="polite"
        class={{ 'field-status': true, [state.status]: true }}
      >
        <span class="visually-hidden">{state.message}</span>
        <sl-icon name={STATUS_ICONS[state.status]} aria-hidden="true"></sl-icon>
      </span>
    </sl-tooltip>
  ) : null;
}

const STATUS_ICONS: Record<FieldState['status'], string> = {
  touched: 'pencil',
  pending: 'hourglass-split',
  success: 'check2-circle',
  error: 'exclamation-triangle',
};
