import { toastController } from '@ionic/core';
import { Component, h, Listen } from '@stencil/core';

@Component({
  tag: 'pos-error-toast',
  shadow: true,
})
export class PosErrorToast {
  @Listen('pod-os:error')
  async catchError(event) {
    event.stopPropagation();
    console.error(event.detail);
    const toast = await toastController.create({
      message: event.detail.message,
      duration: 3000,
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
