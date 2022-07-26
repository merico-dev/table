import {
  IPluginManager,
  VizComponent,
} from '../types/plugin';
import { PluginManager } from './plugin-manager';

// bad path
//    todo: plugin not found
function createMockPlugin(id: string = 'foo', components: string [] = ['mockViz']) {
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

describe('plugin-manager', () => {
  let pm: IPluginManager;
  beforeEach(() => {
    pm = new PluginManager();
  });
  test('create viz component from plugin', () => {
    const mockPlugin = createMockPlugin();
    pm.install(mockPlugin);
    const viz = pm.factory.viz('mockViz');
    expect(viz).toBeDefined();
    expect(viz.name).toBe('mockViz');
  });

  test('plugin id conflicts', () => {
    const plugin1 = createMockPlugin('foo', []);
    const plugin2 = createMockPlugin('foo', []);
    expect(() => {
      pm.install(plugin1);
      pm.install(plugin2);
    }).toThrowError(/Plugin \(.*\) has been installed before/);
  });

  test('viz component name conflicts', () => {
    const plugin1 = createMockPlugin('foo', ['alice', 'alice']);
    expect(() => {
      pm.install(plugin1);
    }).toThrowError(/Viz Component \(.*\) has been installed before/);
  });

  test('viz component not found', () => {
    expect(() => {
      pm.factory.viz('mockViz');
    }).toThrowError(/Viz Component \(.*\) not found/)
  });

});
