/**
 * migrate to v4.5.3
 * Changes: fix mistyped visibleInViewsIDs
 * @param schema
 * @returns schema with version set to 4.5.3
 */
export function main({ filters, views, ...rest }: Record<string, any>) {
  return {
    filters: filters.map((f) => ({
      ...f,
      visibleInViewsIDs: ['Main'],
    })),
    views,
    ...rest,
    version: '4.5.3',
  };
}
