import { RdfType } from '@pod-os/core';
import { selectToolsForTypes } from './selectToolsForTypes';
import { AvailableTools } from './availableTools';

describe('select tools for types', () => {
  it('uses generic app by default', () => {
    const tools = selectToolsForTypes([]);
    expect(tools).toEqual([AvailableTools.Generic]);
  });

  it('uses generic app for unknown types', () => {
    const tools = selectToolsForTypes([{ uri: 'http://example', label: 'Resource' }]);
    expect(tools).toEqual([AvailableTools.Generic]);
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
    const tools = selectToolsForTypes(types);
    expect(tools).toEqual([expectedApp, AvailableTools.Generic]);
  });

  it('favours document viewer over other apps for pdf document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/application/pdf#Resource', label: 'Resource' },
      { uri: 'http://purl.org/dc/terms/Image', label: 'Image' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const tools = selectToolsForTypes(types);
    expect(tools).toEqual([AvailableTools.DocumentViewer, AvailableTools.ImageViewer, AvailableTools.Generic]);
  });

  it('favours document viewer over other apps for html document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/html#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/2007/ont/link#WebPage', label: 'WebPage' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const tools = selectToolsForTypes(types);
    expect(tools).toEqual([AvailableTools.DocumentViewer, AvailableTools.Generic]);
  });

  it('favours document viewer over other apps for markdown document', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/markdown#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const tools = selectToolsForTypes(types);
    expect(tools).toEqual([AvailableTools.DocumentViewer, AvailableTools.Generic]);
  });

  it('favours image viewer over other apps for images', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/image/jpeg#Resource', label: 'Resource' },
      { uri: 'http://purl.org/dc/terms/Image', label: 'Image' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const tools = selectToolsForTypes(types);
    expect(tools).toEqual([AvailableTools.ImageViewer, AvailableTools.DocumentViewer, AvailableTools.Generic]);
  });

  it('favours rdf document app over other apps for rdf documents', () => {
    const types: RdfType[] = [
      { uri: 'http://www.w3.org/ns/iana/media-types/text/turtle#Resource', label: 'Resource' },
      { uri: 'http://www.w3.org/2007/ont/link#RDFDocument', label: 'RDFDocument' },
      { uri: 'http://www.w3.org/2007/ont/link#Document', label: 'Document' },
      { uri: 'http://www.w3.org/ns/ldp#Resource', label: 'Resource' },
    ];
    const tools = selectToolsForTypes(types);
    expect(tools).toEqual([AvailableTools.RdfDocument, AvailableTools.DocumentViewer, AvailableTools.Generic]);
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
    const tools = selectToolsForTypes(types);
    expect(tools).toEqual([
      AvailableTools.LdpContainer,
      AvailableTools.RdfDocument,
      AvailableTools.DocumentViewer,
      AvailableTools.Generic,
    ]);
  });

  it('favours HTML tool over generic if one is available', () => {
    const registeredTools = [
      {
        element: 'pos-html-tool',
        label: 'Example tool',
        icon: 'list-ul',
        types: [
          {
            uri: 'https://schema.org/Recipe',
            priority: 20,
          },
        ],
      },
    ];
    const types = [{ uri: 'https://schema.org/Recipe', label: 'Recipe' }];
    const tools = selectToolsForTypes(types, registeredTools);
    expect(tools).toEqual([registeredTools[0], AvailableTools.Generic]);
  });
});
