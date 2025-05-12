import { toastController } from '@ionic/core';
import { Component, h, Host, Listen } from '@stencil/core';

@Component({
  tag: 'pos-error-toast',
  shadow: true,
})
export class PosErrorToast {
  @Listen('unhandledrejection', { target: 'window' })
  async unhandledRejection(event: PromiseRejectionEvent) {
    event.stopPropagation();
    console.error('unhandled promise rejection', event);
    await this.showToast(event.reason.toString());
  }

  @Listen('pod-os:error')
  async catchError(event) {
    event.stopPropagation();
    console.error(event.detail);
    await this.showToast(event.detail.message);
  }

  private async showToast(message: string) {
    const toast = await toastController.create({
      message,
      duration: 10000,
      position: 'top',
      color: 'danger',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }
  render() {
    return (
      <Host>
        <ion-toast
          trigger="never"
          message="Workarround to preload ion-toast and ion-ripple-effect to be able to show errors while offline"
          duration={0}
        >
          <ion-ripple-effect></ion-ripple-effect>
        </ion-toast>
        <slot></slot>
      </Host>
    );
  }
}
