import { get, isObject, set, unset } from 'lodash';
import { observable, reaction, runInAction, toJS } from 'mobx';
import { IWatchOptions, PluginStorage } from '~/types/plugin';

export class JsonPluginStorage implements PluginStorage {
  protected rootRef: { current: Record<string, $TSFixMe> };

  constructor(initValue: Record<string, $TSFixMe>) {
    this.rootRef = observable({ current: initValue });
  }

  async deleteItem(key: string): Promise<void> {
    runInAction(() => {
      unset(this.rootRef.current, [key]);
    });
  }

  getItem<T>(key: string | null): Promise<T> {
    const value = this.getValueFromRoot(key);
    return Promise.resolve(value);
  }

  private getValueFromRoot(key: string | null) {
    if (key === null) {
      return toJS(this.rootRef.current);
    }
    return get(this.rootRef.current, [key]);
  }

  setItem<T>(key: string | null, item: T): Promise<T> {
    if (key === null) {
      if (isObject(item)) {
        runInAction(() => {
          this.rootRef.current = item;
        });
      } else {
        throw new Error('Cannot set root value to non-object');
      }
    } else {
      runInAction(() => {
        set(this.rootRef.current, [key], item);
      });
    }
    return Promise.resolve(this.getItem<T>(key));
  }

  watchItem<T>(key: string | null, callback: (value: T, previous?: T) => void, options?: IWatchOptions): () => void {
    return reaction(
      () => this.getValueFromRoot(key),
      (value, previous) => {
        callback(value, previous);
      },
      {
        requiresObservable: true,
        fireImmediately: get(options, 'fireImmediately', false),
      },
    );
  }
}
