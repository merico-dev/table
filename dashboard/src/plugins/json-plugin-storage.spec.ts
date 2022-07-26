import { PluginStorage } from '../types/plugin';
import { JsonPluginStorage } from './json-plugin-storage';

describe('JsonPluginStorage', () => {
  let storage:PluginStorage;
  let root:any;
  beforeEach(() => {
    root = {};
    storage = new JsonPluginStorage(root);
  });

  test('set item with object path key', async () => {
    const item = await storage.setItem('foo.bar', true);
    expect(item).toBe(true);
    expect(root).toMatchInlineSnapshot(`
      {
        "foo.bar": true,
      }
    `);
  });
});
