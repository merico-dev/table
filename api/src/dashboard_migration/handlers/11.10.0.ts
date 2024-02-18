import { randomUUID } from 'crypto';
/**
 * https://github.com/merico-dev/table/issues/1347
 */
export function main({ panels, ...rest }: Record<string, any>) {
  const initialLayouts = panels.map((p) => {
    return {
      id: randomUUID(),
      panelID: p.id,
      ...p.layout,
    };
  });
  const panelsWithoutLayout = panels.map(({ layout, ...rest }) => rest);
  return {
    ...rest,
    panels: panelsWithoutLayout,
    layouts: [
      {
        id: 'basis',
        breakpoint: 0,
        list: initialLayouts,
      },
    ],
    version: '11.10.0',
  };
}
