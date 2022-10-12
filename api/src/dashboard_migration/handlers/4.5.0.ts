/**
 * migrate to v4.5.0
 * @param schema
 * @returns schema with version set to 4.5.0
 */
export function main({ filters, panels, ...rest }: Record<string, any>) {
  return {
    filters,
    views: [
      {
        id: 'Main',
        type: 'div',
        config: {},
        panels,
      },
    ],
    ...rest,
    version: '4.5.0',
  };
}
