import { RdfType } from '@pod-os/core';

export interface ToolConfig {
  element: string;
  label: string;
  icon: string;
  types: TypePriority[];
}

interface TypePriority {
  uri: string;
  priority: number;
}

interface ToolPriority {
  tool: ToolConfig;
  priority: number;
}

export const AvailableTools: { [key: string]: ToolConfig } = {
  Generic: {
    element: 'pos-app-generic',
    label: 'Data',
    icon: 'list-ul',
    types: [], // since this is included everywhere, it does not need to specify types
  },
  RdfDocument: {
    element: 'pos-app-rdf-document',
    label: 'Things',
    icon: 'diagram-2',
    types: [
      {
        uri: 'http://www.w3.org/2007/ont/link#RDFDocument',
        priority: 20,
      },
    ],
  },
  DocumentViewer: {
    element: 'pos-app-document-viewer',
    label: 'Doc',
    icon: 'file-text',
    types: [
      {
        uri: mimeType('application/pdf'),
        priority: 30,
      },
      {
        uri: 'http://www.w3.org/2007/ont/link#Document',
        priority: 10,
      },
    ],
  },
  ImageViewer: {
    element: 'pos-app-image-viewer',
    label: 'Pic',
    icon: 'file-image',
    types: [
      {
        uri: 'http://purl.org/dc/terms/Image',
        priority: 20,
      },
    ],
  },
  LdpContainer: {
    element: 'pos-app-ldp-container',
    label: 'Content',
    icon: 'folder',
    types: [{ uri: 'http://www.w3.org/ns/ldp#Container', priority: 30 }],
  },
};

function mimeType(mimeType: string) {
  return 'http://www.w3.org/ns/iana/media-types/' + mimeType + '#Resource';
}

export function selectToolsForTypes(types: RdfType[]) {
  const typeUris = new Set(types.map(type => type.uri));

  return Object.values(AvailableTools)
    .map(maxPriorityFor(typeUris))
    .filter(onlyRelevant)
    .toSorted(byPriority)
    .map(it => it.tool)
    .concat(AvailableTools.Generic);
}

const maxPriorityFor = (typeUris: Set<string>) => tool =>
  ({
    tool,
    priority: maxPriority(tool.types, typeUris),
  }) as ToolPriority;

function maxPriority(types: TypePriority[], typeUris: Set<string>): number {
  return types.filter(type => typeUris.has(type.uri)).reduce((max, type) => Math.max(max, type.priority), 0);
}

const onlyRelevant = (it: ToolPriority) => it.priority > 0;

const byPriority = (a: ToolPriority, b: ToolPriority) => b.priority - a.priority;
