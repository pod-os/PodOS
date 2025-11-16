import { RdfType } from '@pod-os/core';

export function selectIconForTypes(types: RdfType[]) {
  if (containsType(types, 'http://www.w3.org/ns/ldp#Container')) {
    return 'folder2';
  } else if (containsType(types, 'http://www.w3.org/ns/ldp#Resource')) {
    return 'file-earmark';
  } else {
    return 'question-diamond';
  }
}

// TODO: remove duplication with pos-type-router/selectAppForTypes
function containsType(types: RdfType[], typeUri: string) {
  return types.some(type => type.uri === typeUri);
}
