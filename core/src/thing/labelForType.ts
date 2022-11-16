export function labelForType(typeUri: string) {
  if (typeUri.includes("#")) {
    return typeUri.substring(typeUri.lastIndexOf("#") + 1);
  } else {
    return typeUri.substring(typeUri.lastIndexOf("/") + 1);
  }
}
