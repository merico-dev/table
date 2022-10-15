/**
 * migrate to v4.5.2
 * Changes: add visibleInViewsIDs to filter
 * @param schema
 * @returns schema with version set to 4.5.2
 */
export function main({ filters, views, ...rest }: Record<string, any>) {
  return {
    filters: filters.map((f) => ({
      ...f,
      visibleInViewsIDs: 'Main',
    })),
    views,
    ...rest,
    version: '4.5.2',
  };
}
