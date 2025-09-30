import { RdfType } from '@pod-os/core';

export interface ToolConfig {
  element: string;
  label: string;
  icon: string;
}

export const AvailableTools: { [key: string]: ToolConfig } = {
  Generic: {
    element: 'pos-app-generic',
    label: 'Generic',
    icon: 'list-ul',
  },
  RdfDocument: {
    element: 'pos-app-rdf-document',
    label: 'RDF Document',
    icon: 'file-earmark-ruled',
  },
  DocumentViewer: {
    element: 'pos-app-document-viewer',
    label: 'Document',
    icon: 'file-text',
  },
  ImageViewer: {
    element: 'pos-app-image-viewer',
    label: 'Image',
    icon: 'file-image',
  },
  LdpContainer: {
    element: 'pos-app-ldp-container',
    label: 'Container',
    icon: 'folder',
  },
};

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
