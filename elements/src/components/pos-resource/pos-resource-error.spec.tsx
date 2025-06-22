import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosResource } from '../pos-resource/pos-resource';
import { Component, h } from '@stencil/core';
describe('pos-resource', () => {

    @Component({
        tag: 'test-comp',
    })
    class TestComp {
        render() {
            return <pos-resource uri='https://video.test/video-1'></pos-resource>
        }
    }

    for (let x of [1, 2]) {
        it('gets called only once, even if pos-resource is rendered by another component', async () => {
            const os = mockPodOS();
            const page = await newSpecPage({
                components: [PosApp, PosResource, TestComp],
                html: `
                <pos-app>
                    <pos-resource uri="https://resource.test" lazy=""></pos-resource>
                    <test-comp></test-comp>
                </pos-app>`
            });
            expect(os.fetch.mock.calls).toHaveLength(1);
        });
    }

});
