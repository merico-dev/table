export function doesVizRequiresData(type: string) {
  const vizTypes = ['richText', 'button'];
  return !vizTypes.includes(type);
}
