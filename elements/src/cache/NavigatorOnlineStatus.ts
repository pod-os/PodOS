import { OnlineStatus } from '@pod-os/core';

export class NavigatorOnlineStatus implements OnlineStatus {
  isOnline(): boolean {
    return navigator.onLine;
  }
}
