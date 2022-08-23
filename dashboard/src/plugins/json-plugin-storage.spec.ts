import { JsonPluginStorage } from './json-plugin-storage';

class TestJsonPluginStorage extends JsonPluginStorage {
  getRoot() {
    return this.rootRef.current;
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

  test('set root with null key', async () => {
    await storage.setItem('foo', 'init');
    const fooWatcher = vi.fn();
    const rootWatcher = vi.fn();

    const dispose = storage.watchItem('foo', fooWatcher);
    const disposeRoot = storage.watchItem(null, rootWatcher);
    await storage.setItem(null, { foo: 'bar' });
    expect(storage.getRoot()).toStrictEqual({ foo: 'bar' });
    expect(fooWatcher).toHaveBeenCalledWith('bar', 'init');
    expect(rootWatcher).toHaveBeenCalledWith({ foo: 'bar' }, { foo: 'init' });
    dispose();
    disposeRoot();
  });

  test('set root with non-object value', async () => {
    expect.assertions(1);
    try {
      await storage.setItem(null, true);
    } catch (e) {
      expect(e).toMatch(/object/gi);
    }
  });
});
