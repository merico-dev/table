import { Mock } from 'vitest';
import { PluginDataMigrator } from '~/plugins';

describe('PluginDataMigrator', () => {
  let migrator: PluginDataMigrator;
  let handler: Mock;
  beforeEach(() => {
    handler = vi.fn();
    migrator = new PluginDataMigrator();
    for (let i = 1; i < 10; i++) {
      migrator.version(i, handler);
    }
  });
  test('migrate to next version', () => {
    handler.mockReturnValue({ fooBar: 'bar' });
    const v2 = migrator.run({ from: 1, to: 2 }, { foo: 'foo', bar: true });
    expect(v2).toEqual({ fooBar: 'bar' });
    expect(handler).toHaveBeenCalledWith({ foo: 'foo', bar: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });
  test('migrate to next 3 version', () => {
    handler.mockReturnValue({ fooBar: 'bar' });
    const v4 = migrator.run({ from: 1, to: 4 }, { foo: 'foo', bar: true });
    expect(v4).toEqual({ fooBar: 'bar' });
    expect(handler).toHaveBeenCalledWith({ foo: 'foo', bar: true });
    expect(handler).toHaveBeenCalledTimes(3);
  });
  test('migrate to non-existing version', () => {
    expect(() =>
      migrator.run(
        { from: 1, to: 10 },
        {
          foo: 'foo',
          bar: true,
        },
      ),
    ).toThrow(/not found/gi);
  });
  test('migrate from non-existing version should throw', () => {
    expect(() =>
      migrator.run(
        { from: 10, to: 13 },
        {
          foo: 'foo',
          bar: true,
        },
      ),
    ).toThrow(/not found/gi);
  });

  test('migrate to the same version should not throw', () => {
    const result = migrator.run({ from: 2, to: 2 }, { foo: 'foo', bar: true });
    expect(result).toEqual({ foo: 'foo', bar: true });
    expect(handler).toHaveBeenCalledTimes(0);
  });

  test('migrate to a previous version should throw', () => {
    expect(() =>
      migrator.run(
        { from: 5, to: 3 },
        {
          foo: 'foo',
          bar: true,
        },
      ),
    ).toThrow(/downgrade/gi);
  });
});
