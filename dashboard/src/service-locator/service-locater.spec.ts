import { IDisposable, ServiceLocator, token } from '~/service-locator';

describe('ServiceLocator', () => {
  test('provide factor', () => {
    const serviceLocator = new ServiceLocator();
    const fooToken = token<number>('foo');
    serviceLocator.provideFactory(fooToken, () => 42);
    expect(serviceLocator.get(fooToken)).toBe(42);
  });
  test('provide value', () => {
    const serviceLocator = new ServiceLocator();
    const fooToken = token<number>('foo');
    serviceLocator.provideValue(fooToken, 42);
    expect(serviceLocator.get(fooToken)).toBe(42);
  });
  test('singleton', () => {
    const serviceLocator = new ServiceLocator();
    const fooToken = token<{ foo: string }>('foo');
    serviceLocator.provideFactory(fooToken, () => ({ foo: 'bar' }));
    const foo1 = serviceLocator.get(fooToken);
    const foo2 = serviceLocator.get(fooToken);
    expect(foo1).toBe(foo2);
  });
  describe('hierarchical', () => {
    test('get instance from parent', () => {
      const serviceLocator = new ServiceLocator();
      const fooToken = token<number>('foo');
      serviceLocator.provideValue(fooToken, 42);
      const childServiceLocator = serviceLocator.createScoped();
      expect(childServiceLocator.get(fooToken)).toBe(42);
    });
    test('get instance from child', () => {
      const serviceLocator = new ServiceLocator();
      serviceLocator.provideValue(token<number>('foo'), 35);
      const fooToken = token<number>('foo');
      const childServiceLocator = serviceLocator.createScoped();
      childServiceLocator.provideValue(fooToken, 42);
      expect(childServiceLocator.get(fooToken)).toBe(42);
    });
  });

  test('dispose', () => {
    const serviceLocator = new ServiceLocator();
    const dispose = vi.fn();
    const fooToken = token<{ foo: string } & IDisposable>('foo');
    serviceLocator.provideFactory(fooToken, () => ({ foo: 'bar', dispose }));
    serviceLocator.get(fooToken);
    serviceLocator.dispose();
    expect(dispose).toBeCalled();
  });
});
