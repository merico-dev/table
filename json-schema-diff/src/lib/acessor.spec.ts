import { describe, expect, test } from 'vitest';
import { Accessor } from './accessor';

describe('accessor', () => {
  test('undefined does not throw', () => {
    const accessor = new Accessor('foo');
    expect(accessor.in(undefined)).toBe(false);
    expect(accessor.get(undefined)).toBeUndefined();
    expect(() => accessor.set(undefined, 'bar')).not.toThrow();
  });
});
