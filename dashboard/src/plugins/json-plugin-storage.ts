import { get, set } from 'lodash';
import { observable, reaction, runInAction } from 'mobx';
import { PluginStorage } from '../types/plugin';

export class JsonPluginStorage implements PluginStorage {
  protected root: Record<string, any>;

  constructor(initValue: Record<string, any>) {
    this.root = observable(initValue);
  }

  async deleteItem(key: string): Promise<void> {
    runInAction(() => {
      delete this.root[key];
    });
  }

  getItem<T>(key: string): Promise<T> {
    const value = this.getValueFromRoot(key);
    return Promise.resolve(value);
  }

  private getValueFromRoot(key: string) {
    return get(this.root, [key]);
  }

  setItem<T>(key: string, item: T): Promise<T> {
    runInAction(() => {
      set(this.root, [key], item);
    });
    return Promise.resolve(this.getItem(key));
  }

  watchItem<T>(key: string, callback: (value: T, previous?: T) => void): () => void {
    return reaction(() => this.getValueFromRoot(key), (value, previous) => {
      callback(value, previous);
    });
  }
}
