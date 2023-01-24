import { RdfType } from '@pod-os/core';

export function selectIconForTypes(types: RdfType[]) {
  if (containsType(types, 'http://www.w3.org/ns/ldp#Container')) {
    return 'folder-outline';
  } else if (containsType(types, 'http://www.w3.org/ns/ldp#Resource')) {
    return 'document-outline';
  } else {
    return 'help-outline';
  }
}

// TODO: remove duplication with pos-type-router/selectAppForTypes
function containsType(types: RdfType[], typeUri: string) {
  return types.some(type => type.uri === typeUri);
}
