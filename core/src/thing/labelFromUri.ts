/**
 * Generates a short human-readable label for a given URI
 * @param uri
 */
export function labelFromUri(uri: string) {
  const url = new URL(uri);
  if (isTooGeneric(url.hash)) {
    return (getFilename(url) || url.host + url.pathname) + url.hash;
  }

  return labelFromFragment(url.hash) || getFilename(url) || url.host;
}

function labelFromFragment(fragment: string | null) {
  return fragment ? fragment.split("#")[1] : null;
}

function isTooGeneric(fragment: string) {
  const genericFragments = ["#it", "#this", "#me", "#i"];
  return genericFragments.includes(fragment);
}

function getFilename(url: URL) {
  if (url.pathname.endsWith("/")) {
    const containerName = url.pathname.split("/").at(-2);
    return containerName ? containerName + "/" : null;
  } else {
    return url.pathname.split("/").pop();
  }
}
