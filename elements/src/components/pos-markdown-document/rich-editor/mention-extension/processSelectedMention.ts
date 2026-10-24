import { MentionItem } from './pos-mention-menu/pos-mention-menu';
import { PodOS } from '@pod-os/core';

export function processSelectedMention(os: PodOS, command: (item: MentionItem) => void) {
  return (item: MentionItem) => {
    if (item.type === 'new-thing') {
      os.addNewThing(item.id, item.label, 'https://schema.org/Thing').then(() => {
        // TODO handle success and error
      });
    }
    command(item);
  };
}
