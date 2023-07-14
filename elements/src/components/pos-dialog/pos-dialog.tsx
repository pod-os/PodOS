import { Component, Host, h, Prop, Method } from '@stencil/core';

@Component({
    tag: 'pos-dialog',
    styleUrl: 'pos-dialog.css',
    shadow: true,
})
export class PosDialog {

    private dialog: HTMLDialogElement;

    @Method()
    async showModal() {
        this.dialog.showModal();
    }

    @Method()
    async close() {
        this.dialog.close();
    }

    render() {
        return (
            <Host>
                <dialog ref={el => (this.dialog = el as HTMLDialogElement)} >
                    <header>
                        <span id="title"><slot /></span>
                        <button tabindex={-1} id="close" title="Close" onClick={() => this.close()}>
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                    </header>
                    <slot />
                </dialog>
            </Host>)
    }
}