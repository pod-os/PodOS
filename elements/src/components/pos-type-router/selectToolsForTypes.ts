import { RdfType } from '@pod-os/core';

export interface ToolConfig {
  element: string;
  label: string;
}

export const AvailableTools = {
  Generic: {
    element: 'pos-app-generic',
    label: 'Generic',
  } as ToolConfig,
  RdfDocument: {
    element: 'pos-app-rdf-document',
    label: 'RDF Document',
  } as ToolConfig,
  DocumentViewer: {
    element: 'pos-app-document-viewer',
    label: 'Document',
  } as ToolConfig,
  ImageViewer: {
    element: 'pos-app-image-viewer',
    label: 'Image',
  } as ToolConfig,
  LdpContainer: {
    element: 'pos-app-ldp-container',
    label: 'Container',
  } as ToolConfig,
} as const;

// TODO: remove duplication with pos-container-contents/selectIconForTypes
function containsType(types: RdfType[], typeUri: string) {
  return types.some(type => type.uri === typeUri);
}

export function selectToolsForTypes(types: RdfType[]) {
  if (containsType(types, 'http://www.w3.org/ns/ldp#Container')) {
    return [AvailableTools.LdpContainer, AvailableTools.Generic];
  } else if (containsType(types, 'http://www.w3.org/2007/ont/link#RDFDocument')) {
    return [AvailableTools.RdfDocument, AvailableTools.Generic];
  } else if (containsType(types, 'http://www.w3.org/ns/iana/media-types/application/pdf#Resource')) {
    return [AvailableTools.DocumentViewer, AvailableTools.Generic];
  } else if (containsType(types, 'http://purl.org/dc/terms/Image')) {
    return [AvailableTools.ImageViewer, AvailableTools.Generic];
  } else if (containsType(types, 'http://www.w3.org/2007/ont/link#Document')) {
    return [AvailableTools.DocumentViewer, AvailableTools.Generic];
  } else {
    return [AvailableTools.Generic];
  }
}
