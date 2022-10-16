/**
 * Changes: introduce panel.style & panel.style.border
 * @param schema
 * @returns new schema
 */
export function main({ views, ...rest }: Record<string, any>) {
  return {
    views: views.map((v) => ({
      ...v,
      panels: v.panels.map((p) => ({
        ...p,
        style: {
          border: {
            enabled: true,
          },
        },
      })),
    })),
    ...rest,
    version: '4.10.0',
  };
}
