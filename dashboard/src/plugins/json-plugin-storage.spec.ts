import { JsonPluginStorage } from './json-plugin-storage';

class TestJsonPluginStorage extends JsonPluginStorage {
  getRoot() {
    return this.root;
  }
}

describe('JsonPluginStorage', () => {
  let storage: TestJsonPluginStorage;
  beforeEach(() => {
    storage = new TestJsonPluginStorage({});
  });

  test('set item with object path key', async () => {
    const item = await storage.setItem('foo.bar', true);
    expect(item).toBe(true);
    expect(storage.getRoot()).toMatchInlineSnapshot(`
      {
        "foo.bar": true,
      }
    `);
  });
  test('watch item changes', async () => {
    const callback = vi.fn();
    const dispose = storage.watchItem('foo', callback);
    await storage.setItem('foo', true);
    expect(callback).toHaveBeenCalledWith(true, undefined);
    callback.mockClear();
    await storage.setItem('foo', true);
    expect(callback).not.toHaveBeenCalled();
    callback.mockClear();
    await storage.setItem('foo', false);
    expect(callback).toHaveBeenCalledWith(false, true);
    callback.mockClear();
    dispose();
    await storage.setItem('foo', false);
    expect(callback).not.toHaveBeenCalled();
  });

  test('get item with null to retrieve the root node', async () => {
    await storage.setItem('foo', true);
    const item = await storage.getItem(null);
    expect(item).toStrictEqual({ foo: true });
  });
  test('watch item changes with null key', async () => {
    const callback = vi.fn();
    const dispose = storage.watchItem(null, callback);
    await storage.setItem('foo', true);
    expect(callback).toHaveBeenCalledWith({ foo: true }, {});
    dispose();
  });
});
