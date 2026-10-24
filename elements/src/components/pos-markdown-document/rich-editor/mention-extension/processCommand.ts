import { MentionItem } from './pos-mention-menu/pos-mention-menu';
import { PodOS } from '@pod-os/core';

export function processCommand(_: PodOS, command: (item: MentionItem) => void) {
  return (item: MentionItem) => {
    command(item);
  };
}
