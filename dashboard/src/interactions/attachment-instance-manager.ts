import _ from 'lodash';
import { values } from 'lodash';
import { SubTreeJsonPluginStorage } from '~/components/plugins/sub-tree-json-plugin-storage';
import { PluginStorage, VizInstance } from '~/types/plugin';
import { ClearFilterValues } from './operation/operations/clear-filter-values';
import { SetFilterValues } from './operation/operations/set-filter-values';
import { OpenLink } from './operation/operations/open-link';
import { OpenView } from './operation/operations/open-view';
import { ConsoleLog } from './operation/operations/console-log';

const TempOperationOrders = {
  [ConsoleLog.id]: 1,
  [ClearFilterValues.id]: 2,
  [SetFilterValues.id]: 3,
  [OpenView.id]: 4,
  [OpenLink.id]: 5,
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
