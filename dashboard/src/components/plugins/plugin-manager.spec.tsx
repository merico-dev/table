import { IPluginManager } from '~/types/plugin';
import { PluginManager } from './plugin-manager';
import { createMockPlugin } from './test-utils';

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
    }).toThrowError(/Viz Component \(.*\) not found/);
  });
});
