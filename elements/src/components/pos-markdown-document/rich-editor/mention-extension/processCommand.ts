import { MentionItem } from './pos-mention-menu/pos-mention-menu';

export function processCommand(command: (item: MentionItem) => void) {
  return (item: MentionItem) => {
    command(item);
  };
}
