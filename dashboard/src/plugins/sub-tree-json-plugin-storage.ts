import { get, omit } from 'lodash';
import { PluginStorage } from '../types/plugin';

export class SubTreeJsonPluginStorage implements PluginStorage {
  constructor(protected root: PluginStorage, protected path: string) {}

  async deleteItem(key: string): Promise<void> {
    if (key === null) {
      await this.root.deleteItem(this.path);
    }
    const data = (await this.root.getItem<Record<string, unknown>>(this.path)) || {};
    await this.root.setItem(this.path, omit(data, key));
  }

  async getItem<T>(key: string | null): Promise<T> {
    const data = await this.root.getItem<Record<string, unknown>>(this.path);
    return key === null ? (data as T) : (get(data, key) as T);
  }

  async setItem<T>(key: string | null, item: T): Promise<T> {
    if (key === null) {
      await this.root.setItem<T>(this.path, item);
    } else {
      const data = (await this.root.getItem<T>(this.path)) || {};
      await this.root.setItem(this.path, { ...data, [key]: item });
    }
    return await this.getItem(key);
  }

  watchItem<T>(key: string | null, callback: (value: T, previous?: T) => void): () => void {
    if (key === null) {
      return this.root.watchItem(this.path, (value, previous) => {
        callback(value as T, previous as T);
      });
    }
    return this.root.watchItem(this.path, (rootValue, rootPrevious) => {
      const value = get(rootValue, key);
      const previous = get(rootPrevious, key);
      if (value !== previous) {
        callback(value as T, previous as T);
      }
    });
  }
}
