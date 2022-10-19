/**
 * Changes: add default_value to filter.date_range
 * @param schema
 * @returns new schema
 */
export function main({ filters, views, ...rest }: Record<string, any>) {
  return {
    filters: filters.map((f) => {
      if (f.type !== 'date-range') {
        return f;
      }
      return {
        ...f,
        config: {
          ...f.config,
          default_value: Array.isArray(f.config.default_value) ? f.config.default_value : [null, null],
        },
      };
    }),
    views,
    ...rest,
    version: '4.14.1',
  };
}
