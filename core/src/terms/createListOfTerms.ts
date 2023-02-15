export const createListOfTerms = (terms: {
  [prefix: string]: { [name: string]: string };
}) =>
  Object.keys(terms).flatMap((prefix) => {
    return Object.keys(terms[prefix]).map((name) => ({
      uri: terms[prefix][name],
      shorthand: `${prefix}:${name}`,
    }));
  });
