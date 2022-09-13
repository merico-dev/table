import { get, values } from 'lodash';
import { toJS } from 'mobx';
import { SubTreeJsonPluginStorage } from '~/plugins/sub-tree-json-plugin-storage';
import { AnyObject } from '~/types';
import {
  ITrigger,
  ITriggerSchema,
  ITriggerSnapshot,
  IVizTriggerManager,
  PluginStorage,
  VizComponent,
  VizInstance,
} from '~/types/plugin';
import { AttachmentInstanceManager } from '../attachment-instance-manager';

export const TRIGGERS_KEY = '__TRIGGERS';

export class VizTriggerManager implements IVizTriggerManager {
  protected attachments: AttachmentInstanceManager<ITrigger>;

  constructor(protected instance: VizInstance, protected component: VizComponent) {
    const constructInstance = async (storage: PluginStorage) => {
      const { id, schemaRef } = await storage.getItem(null);
      return {
        id,
        schemaRef,
        triggerData: new SubTreeJsonPluginStorage(storage, 'data'),
      };
    };
    this.attachments = new AttachmentInstanceManager(instance, TRIGGERS_KEY, constructInstance);
  }

  watchTriggerSnapshotList(callback: (triggerList: ITriggerSnapshot<AnyObject>[]) => void): () => void {
    return this.instance.instanceData.watchItem(
      TRIGGERS_KEY,
      (entries) => {
        const triggerValues = values(entries).map(
          (value) =>
            ({
              id: get(value, 'id'),
              schemaRef: get(value, 'schemaRef'),
              config: toJS(get(value, 'data.config')),
            } as ITriggerSnapshot<AnyObject>),
        );
        callback(triggerValues);
      },
      { fireImmediately: true },
    );
  }

  async createOrGetTrigger(
    id: string,
    schema: ITriggerSchema,
    options: { recreate: boolean } = { recreate: false },
  ): Promise<ITrigger> {
    // check if schema is valid
    const schemaList = this.getTriggerSchemaList();
    if (!schemaList.some((s) => s.id === schema.id)) {
      throw new Error(`Trigger schema '${schema.id}' is not defined in component '${this.component.name}'`);
    }
    const trigger = await this.attachments.getInstance(id);
    const shouldRecreate = !trigger || options.recreate || trigger.schemaRef !== schema.id;
    if (shouldRecreate) {
      return await this.attachments.create(id, {
        id,
        schemaRef: schema.id,
        data: {},
      });
    }
    return trigger;
  }

  async getTriggerList(): Promise<ITrigger[]> {
    return await this.attachments.list();
  }

  getTriggerSchemaList(): ITriggerSchema[] {
    return this.component.triggers || [];
  }

  async removeTrigger(triggerId: string): Promise<void> {
    await this.attachments.remove(triggerId);
  }

  async retrieveTrigger(id: string) {
    return await this.attachments.getInstance(id);
  }
}
