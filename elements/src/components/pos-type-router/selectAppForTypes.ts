import { RdfType } from '@pod-os/core';

export enum AvailableApps {
  Generic = 'pos-app-generic',
  RdfDocument = 'pos-app-rdf-document',
  DocumentViewer = 'pos-app-document-viewer',
  ImageViewer = 'pos-app-image-viewer',
  LdpContainer = 'pos-app-ldp-container',
}

function containsType(types: RdfType[], typeUri: string) {
  return types.some(type => type.uri === typeUri);
}

export function selectAppForTypes(types: RdfType[]) {
  if (containsType(types, 'http://www.w3.org/ns/ldp#Container')) {
    return AvailableApps.LdpContainer;
  } else if (containsType(types, 'http://www.w3.org/2007/ont/link#RDFDocument')) {
    return AvailableApps.RdfDocument;
  } else if (containsType(types, 'http://www.w3.org/ns/iana/media-types/application/pdf#Resource')) {
    return AvailableApps.DocumentViewer;
  } else if (containsType(types, 'http://purl.org/dc/terms/Image')) {
    return AvailableApps.ImageViewer;
  } else if (containsType(types, 'http://www.w3.org/2007/ont/link#Document')) {
    return AvailableApps.DocumentViewer;
  } else {
    return AvailableApps.Generic;
  }
}
