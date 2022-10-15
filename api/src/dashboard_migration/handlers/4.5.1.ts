/**
 * migrate to v4.5.1
 * Changes: add name to view
 * @param schema
 * @returns schema with version set to 4.5.1
 */
export function main({ filters, views, ...rest }: Record<string, any>) {
  return {
    filters,
    views: views.map((v) => ({
      ...v,
      name: v.id,
    })),
    ...rest,
    version: '4.5.1',
  };
}
