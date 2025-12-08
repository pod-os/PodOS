import { ToolConfig } from './selectToolsForTypes';

export const AvailableTools: { [key: string]: ToolConfig } = {
  Generic: {
    element: 'pos-app-generic',
    label: 'Data',
    icon: 'list-ul',
    types: [], // since this is included everywhere, it does not need to specify types
  },
  Attachments: {
    element: 'pos-tool-attachments',
    label: 'Attach',
    icon: 'paperclip',
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
