import { get, set } from 'lodash';
import { PluginStorage } from '../types/plugin';

export class JsonPluginStorage implements PluginStorage {
  constructor(private root: Record<string, any>) {
  }

  async deleteItem(key: string): Promise<void> {
    delete this.root[key];
  }

  getItem<T>(key: string): Promise<T> {
    return Promise.resolve(get(this.root, [key]));
  }

  setItem<T>(key: string, item: T): Promise<T> {
    set(this.root, [key], item);
    return Promise.resolve(this.getItem(key));
  }
}
