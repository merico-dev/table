/**
 * Changes: add variables to panel config
 * @param schema
 * @returns new schema
 */
export function main({ views, ...rest }: Record<string, any>) {
  return {
    views: views.map((view: Record<string, any>) => {
      return {
        panels: view.panels.map((panel: Record<string, any>) => {
          return {
            variables: panel.variables || [],
            ...panel,
          };
        }),
        ...view,
      };
    }),
    ...rest,
    version: '5.9.2',
  };
}
