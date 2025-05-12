export interface OnlineStatus {
  isOnline(): boolean;
}

export class AssumeAlwaysOnline implements OnlineStatus {
  isOnline() {
    return true;
  }
}
