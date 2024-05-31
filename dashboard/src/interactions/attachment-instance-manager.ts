import _, { values } from 'lodash';
import { SubTreeJsonPluginStorage } from '~/components/plugins/sub-tree-json-plugin-storage';
import { PluginStorage, VizInstance } from '~/types/plugin';

const TempOperationOrders: Record<string, number> = {
  'builtin:op:debug': 1,
  'builtin:op:clear_filter_values': 2,
  'builtin:op:set_filter_values': 3,
  'builtin:op:open_view': 4,
  'builtin:op:open-link': 5,
};
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
    const orderedInstanceList = _.orderBy(
      values(instanceList),
      (instance) => TempOperationOrders[instance.schemaRef] ?? 10,
    );
    return Promise.all(
      orderedInstanceList.map((instance) =>
        this.constructInstance(new SubTreeJsonPluginStorage(this.attachmentStorage, instance.id)),
      ),
    );
  }
}
