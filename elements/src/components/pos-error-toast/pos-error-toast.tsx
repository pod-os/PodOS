import { toastController } from '@ionic/core';
import { Component, h, Listen } from '@stencil/core';

@Component({
  tag: 'pos-error-toast',
  shadow: true,
})
export class PosErrorToast {
  @Listen('unhandledrejection', { target: 'window' })
  async unhandledRejection(event) {
    await this.showToast(event.reason);
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
    return <slot></slot>;
  }
}
