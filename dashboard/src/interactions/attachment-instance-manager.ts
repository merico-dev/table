import { values } from 'lodash';
import { SubTreeJsonPluginStorage } from '~/plugins/sub-tree-json-plugin-storage';
import { PluginStorage, VizInstance } from '~/types/plugin';

export class AttachmentInstanceManager<T extends { id: string }> {
  protected attachmentStorage: PluginStorage;

  constructor(
    protected instance: VizInstance,
    protected attachmentKey: string,
    protected constructInstance: (storage: PluginStorage) => Promise<T>,
  ) {
    this.attachmentStorage = new SubTreeJsonPluginStorage(instance.instanceData, attachmentKey);
  }

  async getInstance(id: string): Promise<T | undefined> {
    const instance = (await this.attachmentStorage.getItem(id)) as T | undefined;
    if (instance) {
      return this.constructInstance(new SubTreeJsonPluginStorage(this.attachmentStorage, id));
    }
    return undefined;
  }

  async create<TD>(id: string, initValue: TD): Promise<T> {
    await this.attachmentStorage.setItem(id, initValue);
    return this.constructInstance(new SubTreeJsonPluginStorage(this.attachmentStorage, id));
  }

  async remove(id: string): Promise<void> {
    await this.attachmentStorage.deleteItem(id);
  }

  async list(): Promise<T[]> {
    const instanceList = await this.attachmentStorage.getItem(null);
    return Promise.all(
      values(instanceList).map((instance) =>
        this.constructInstance(new SubTreeJsonPluginStorage(this.attachmentStorage, instance.id)),
      ),
    );
  }
}
