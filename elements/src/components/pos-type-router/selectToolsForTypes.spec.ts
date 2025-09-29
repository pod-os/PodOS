import { RdfType } from '@pod-os/core';
import { AvailableTools, selectToolsForTypes } from './selectToolsForTypes';

describe('select app for types', () => {
  it('uses generic app by default', () => {
    const app = selectToolsForTypes([]);
    expect(app).toEqual([AvailableTools.Generic]);
  });

  it('uses generic app for unknown types', () => {
    const app = selectToolsForTypes([{ uri: 'http://example', label: 'Resource' }]);
    expect(app).toEqual([AvailableTools.Generic]);
  });

  it.each`
    typeUri                                                             | expectedApp
    ${'http://www.w3.org/2007/ont/link#RDFDocument'}                    | ${AvailableTools.RdfDocument}
    ${'http://www.w3.org/ns/iana/media-types/application/pdf#Resource'} | ${AvailableTools.DocumentViewer}
    ${'http://purl.org/dc/terms/Image'}                                 | ${AvailableTools.ImageViewer}
    ${'http://www.w3.org/2007/ont/link#Document'}                       | ${AvailableTools.DocumentViewer}
    ${'http://www.w3.org/ns/ldp#Container'}                             | ${AvailableTools.LdpContainer}
  `(`selects app $expectedApp app for single type $typeUri`, ({ typeUri, expectedApp }) => {
    const types: RdfType[] = [{ uri: typeUri, label: 'irrelevant here' }];
    const app = selectToolsForTypes(types);
    expect(app).toEqual([expectedApp]);
  });

  it('favours document viewer over other apps for pdf document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/application/pdf#Resource', label: 'Resource' },
      { uri: 'http://purl.org/dc/terms/Image', label: 'Image' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectToolsForTypes(types);
    expect(app).toEqual([AvailableTools.DocumentViewer]);
  });

  it('favours document viewer over other apps for html document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/html#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/2007/ont/link#WebPage', label: 'WebPage' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectToolsForTypes(types);
    expect(app).toEqual([AvailableTools.DocumentViewer]);
  });

  it('favours document viewer over other apps for markdown document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/markdown#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectToolsForTypes(types);
    expect(app).toEqual([AvailableTools.DocumentViewer]);
  });

  it('favours image viewer over other apps for images', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/image/jpeg#Resource', label: 'Resource' },
      { uri: 'http://purl.org/dc/terms/Image', label: 'Image' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectToolsForTypes(types);
    expect(app).toEqual([AvailableTools.ImageViewer]);
  });

  it('favours rdf document app over other apps for rdf documents', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/turtle#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#RDFDocument', label: 'RDFDocument' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const app = selectToolsForTypes(types);
    expect(app).toEqual([AvailableTools.RdfDocument]);
  });

  it('favours ldp container app over other apps for ldp containers', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/turtle#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#RDFDocument', label: 'RDFDocument' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/ns/ldp#Container', label: 'Container' },
      { uri: 'http://www.w3.org/ns/ldp#BasicContainer', label: 'BasicContainer' },
    ];
    const app = selectToolsForTypes(types);
    expect(app).toEqual([AvailableTools.LdpContainer]);
  });
});
