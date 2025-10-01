import { RdfType } from '@pod-os/core';

interface TypePriority {
  type: string;
  priority: number;
}

export interface ToolConfig {
  element: string;
  label: string;
  icon: string;
  types: TypePriority[];
}

export const AvailableTools: { [key: string]: ToolConfig } = {
  Generic: {
    element: 'pos-app-generic',
    label: 'Generic',
    icon: 'list-ul',
    types: [],
  },
  RdfDocument: {
    element: 'pos-app-rdf-document',
    label: 'RDF Document',
    icon: 'file-earmark-ruled',
    types: [
      {
        type: 'http://www.w3.org/2007/ont/link#RDFDocument',
        priority: 20,
      },
    ],
  },
  DocumentViewer: {
    element: 'pos-app-document-viewer',
    label: 'Document',
    icon: 'file-text',
    types: [
      {
        type: mimeType('application/pdf'),
        priority: 30,
      },
      {
        type: 'http://www.w3.org/2007/ont/link#Document',
        priority: 10,
      },
    ],
  },
  ImageViewer: {
    element: 'pos-app-image-viewer',
    label: 'Image',
    icon: 'file-image',
    types: [
      {
        type: 'http://purl.org/dc/terms/Image',
        priority: 20,
      },
    ],
  },
  LdpContainer: {
    element: 'pos-app-ldp-container',
    label: 'Container',
    icon: 'folder',
    types: [{ type: 'http://www.w3.org/ns/ldp#Container', priority: 30 }],
  },
};

function mimeType(mimeType: string) {
  return 'http://www.w3.org/ns/iana/media-types/' + mimeType + '#Resource';
}

export function selectToolsForTypes(types: RdfType[]) {
  return [
    ...Object.values(AvailableTools)
      .map(tool => {
        const matchingTypes = tool.types.filter(typePriority => types.some(type => type.uri === typePriority.type));
        if (matchingTypes.length > 0) {
          const highestPriority = Math.max(...matchingTypes.map(t => t.priority));
          return { tool, priority: highestPriority };
        }
        return null;
      })
      .filter(Boolean),
    { tool: AvailableTools.Generic, priority: 0 },
  ]
    .toSorted((a, b) => b.priority - a.priority)
    .map(item => item.tool);
}
