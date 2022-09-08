import { VizComponent } from '~/types/plugin';

export function createMockPlugin(id = 'foo', components: string[] = ['mockViz'], others: Partial<VizComponent> = {}) {
  return {
    id: id,
    manifest: {
      color: [],
      viz: components.map(
        (name) =>
          ({
            name,
            configRender: () => <span>Hello</span>,
            viewRender: () => <span>World</span>,
            migrator: {} as any,
            ...others,
          } as VizComponent),
      ),
    },
    version: '1.1.1',
  };
}
