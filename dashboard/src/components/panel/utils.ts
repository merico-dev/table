export function doesVizRequiresData(type: string) {
  const vizTypes = ['richText', 'button', 'vizDashboardState'];
  return !vizTypes.includes(type);
}
