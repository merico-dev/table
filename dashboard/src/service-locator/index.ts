import { get, isFunction } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Token<T> {
  symbol: symbol;

  constructor(id: string) {
    this.symbol = Symbol(id);
  }
}

export function token<T>(id: string): Token<T> {
  return new Token<T>(id);
}

export interface IDisposable {
  dispose(): void;
}

export interface IServiceLocator {
  provideFactory: <T>(token: Token<T>, factory: (env: IServiceLocator) => T) => this;
  provideValue: <T>(token: Token<T>, value: T) => this;
  createScoped: () => IServiceLocator;
  get: <T>(token: Token<T>) => T | undefined;
  dispose: () => void;
  getRequired<T>(token: Token<T>): T;
}

export class ServiceLocator implements IServiceLocator, IDisposable {
  protected parent?: IServiceLocator;
  protected factoryRegistry: Map<symbol, (env: IServiceLocator) => unknown> = new Map<
    symbol,
    (env: IServiceLocator) => unknown
  >();
  protected instanceRegistry: Map<symbol, unknown> = new Map<symbol, unknown>();

  createScoped(): IServiceLocator {
    const child = new ServiceLocator();
    child.parent = this;
    return child;
  }

  getRequired<T>(token: Token<T>): T {
    return this.get(token) as T;
  }

  get<T>(token: Token<T>): T | undefined {
    // resolve from instance registry
    if (this.instanceRegistry.has(token.symbol)) {
      return this.instanceRegistry.get(token.symbol) as T;
    }
    // create new instance
    const factory = this.factoryRegistry.get(token.symbol);
    if (factory) {
      const instance = factory(this);
      this.instanceRegistry.set(token.symbol, instance);
      return instance as T;
    }
    if (this.parent) {
      return this.parent.get(token);
    }
  }

  provideFactory<T>(token: Token<T>, factory: (env: IServiceLocator) => T) {
    if (this.factoryRegistry.has(token.symbol)) {
      console.warn(`Token ${token.symbol.toString()} is already registered`);
    } else {
      this.factoryRegistry.set(token.symbol, factory);
    }
    return this;
  }

  provideValue<T>(token: Token<T>, value: T) {
    if (this.factoryRegistry.has(token.symbol)) {
      console.warn(`Token ${token.symbol.toString()} is already registered`);
    } else {
      this.factoryRegistry.set(token.symbol, () => value);
    }
    return this;
  }

  dispose() {
    this.instanceRegistry.forEach((instance) => {
      const dispose = get(instance, 'dispose');
      if (isFunction(dispose)) {
        // @ts-expect-error FIXME: type never
        dispose.bind(instance)();
      }
    });
    this.instanceRegistry.clear();
    this.factoryRegistry.clear();
  }
}
