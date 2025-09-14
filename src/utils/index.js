export function createPageUrl(name) {
  return `/${String(name).replace(/\s+/g, '')}`;
}
