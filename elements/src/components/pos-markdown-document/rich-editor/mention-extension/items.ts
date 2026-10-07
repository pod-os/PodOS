import { Editor } from '@tiptap/core';

export const items = ({ query }: { query: string; editor: Editor; signal: AbortSignal }) => {
  return [
    { id: 'http://localhost:3000/alice/profile/card#me', label: 'Alice' },
    { id: 'http://localhost:3000/bob/profile/card#me', label: 'Bob' },
    { id: 'http://localhost:3000/carol/profile/card#me', label: 'Carol' },
  ].filter(person => person.label.toLowerCase().includes(query.toLowerCase()));
};
