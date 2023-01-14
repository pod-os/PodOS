import { RdfType } from '@pod-os/core';
import { AvailableApps, selectAppForTypes } from './selectAppForTypes';

describe('select app for types', () => {
  it('uses generic app by default', () => {
    const app = selectAppForTypes([]);
    expect(app).toBe(AvailableApps.Generic);
  });

  it('uses generic app for unknown types', () => {
    const app = selectAppForTypes([{ uri: 'http://example', label: 'Resource' }]);
    expect(app).toBe(AvailableApps.Generic);
  });

  it.each`
    typeUri                                                             | expectedApp
    ${'http://www.w3.org/2007/ont/link#RDFDocument'}                    | ${'pos-app-rdf-document'}
    ${'http://www.w3.org/ns/iana/media-types/application/pdf#Resource'} | ${'pos-app-document-viewer'}
    ${'http://purl.org/dc/terms/Image'}                                 | ${'pos-app-image-viewer'}
    ${'http://www.w3.org/2007/ont/link#Document'}                       | ${'pos-app-document-viewer'}
  `(`selects app $expectedApp app for single type $typeUri`, ({ typeUri, expectedApp }) => {
    const types: RdfType[] = [{ uri: typeUri, label: 'irrelevant here' }];
    const app = selectAppForTypes(types);
    expect(app).toBe(expectedApp);
  });

  it('favours document viewer over other apps for pdf document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/application/pdf#Resource', label: 'Resource' },
      { uri: 'http://purl.org/dc/terms/Image', label: 'Image' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectAppForTypes(types);
    expect(app).toBe(AvailableApps.DocumentViewer);
  });

  it('favours document viewer over other apps for html document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/html#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/2007/ont/link#WebPage', label: 'WebPage' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectAppForTypes(types);
    expect(app).toBe(AvailableApps.DocumentViewer);
  });

  it('favours document viewer over other apps for markdown document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/markdown#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectAppForTypes(types);
    expect(app).toBe(AvailableApps.DocumentViewer);
  });

  it('favours image viewer over other apps for images', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/image/jpeg#Resource', label: 'Resource' },
      { uri: 'http://purl.org/dc/terms/Image', label: 'Image' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectAppForTypes(types);
    expect(app).toBe(AvailableApps.ImageViewer);
  });

  it('favours rdf document app over other apps for rdf documents', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/turtle#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#RDFDocument', label: 'RDFDocument' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectAppForTypes(types);
    expect(app).toBe(AvailableApps.RdfDocument);
  });
});
