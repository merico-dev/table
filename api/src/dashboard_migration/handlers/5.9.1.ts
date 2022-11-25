/**
 * Changes: add _name to filter.config to avoid incorrect type inference
 * @param schema
 * @returns new schema
 */
export function main({ filters, views, ...rest }: Record<string, any>) {
  return {
    filters: filters.map((f) => ({
      ...f,
      config: {
        _name: f.type,
        ...f.config,
      },
    })),
    views,
    ...rest,
    version: '5.9.1',
  };
}
