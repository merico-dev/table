import { PluginStorage } from '../types/plugin';
import { JsonPluginStorage } from './json-plugin-storage';
import { SubTreeJsonPluginStorage } from './sub-tree-json-plugin-storage';

describe('SubTreeJsonPluginStorage', () => {
  let root: PluginStorage;
  let subTree: PluginStorage;
  beforeEach(() => {
    root = new JsonPluginStorage({});
    subTree = new SubTreeJsonPluginStorage(root, 'sub');
  });
  test('setItem', async () => {
    await subTree.setItem('foo', 'value');
    expect(await root.getItem('sub')).toStrictEqual({ foo: 'value' });
  });
  test('set root item', async () => {
    await subTree.setItem(null, { foo: 'value' });
    expect(await root.getItem('sub')).toStrictEqual({ foo: 'value' });
  });
  test('getItem', async () => {
    await root.setItem('sub', { foo: 'value' });
    expect(await subTree.getItem('foo')).toBe('value');
  });
  test('delete item', async () => {
    await root.setItem('sub', { foo: 'value' });
    await subTree.deleteItem('foo');
    expect(await root.getItem('sub')).toStrictEqual({});
  });

  test('watch item', async () => {
    await root.setItem('sub', { foo: 'value' });
    const callback = jest.fn();
    const dispose = subTree.watchItem('foo', callback);
    // change by root
    await root.setItem('sub', { foo: 'value2' });
    expect(callback).toBeCalledWith('value2', 'value');
    // change by subTree
    await subTree.setItem('foo', 'value3');
    expect(callback).toBeCalledWith('value3', 'value2');
    dispose();
    await subTree.setItem('foo', 'value4');
    expect(callback).toBeCalledTimes(2);
  });
});
