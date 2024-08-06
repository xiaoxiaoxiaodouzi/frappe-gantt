import { jsonToGraphQLQuery } from 'json-to-graphql-query';

export function resolveJson(path, separator = '.', value = true) {
  if (!path) {
    return null;
  }
  const jsonObj = {};
  const properties = Array.isArray(path) ? path : path.split(separator);
  properties.reduce((prev, curr, currentIndex) => {
    if (prev) {
      if (currentIndex === properties.length - 1) {
        prev[curr] = value;
      } else {
        prev[curr] = {};
      }
    }
    return prev[curr];
  }, jsonObj);
  return jsonObj;
}

export function convertsToGraphQLQuery(obj) {
  return jsonToGraphQLQuery(obj, { pretty: true });
}
