import { VizComponent } from '../types/plugin';

export function createMockPlugin(id: string = 'foo', components: string [] = ['mockViz']) {
  return {
    id: id,
    manifest: {
      color: [], viz: components.map(name => ({
        name,
        configRender: () => <span>Hello</span>,
        viewRender: () => <span>World</span>,
        migration: async () => {
        }
      } as VizComponent))
    },
    version: '1.1.1'
  };
}
