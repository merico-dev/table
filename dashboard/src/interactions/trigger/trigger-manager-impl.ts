import { values } from 'lodash';
import { SubTreeJsonPluginStorage } from '../../plugins/sub-tree-json-plugin-storage';
import {
  ITrigger,
  ITriggerSchema,
  IVizTriggerManager,
  PluginStorage,
  VizComponent,
  VizInstance,
} from '../../types/plugin';

export class VizTriggerManager implements IVizTriggerManager {
  protected triggersStorage: PluginStorage;

  constructor(protected instance: VizInstance, protected component: VizComponent) {
    this.triggersStorage = new SubTreeJsonPluginStorage(instance.instanceData, '__TRIGGERS');
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
    const trigger = await this.getTrigger(id);
    const shouldRecreate = !trigger || options.recreate || trigger.schemaRef !== schema.id;
    if (shouldRecreate) {
      await this.triggersStorage.setItem(id, {
        id,
        schemaRef: schema.id,
      });
    }
    return {
      id,
      schemaRef: schema.id,
      triggerData: this.createTriggerDataStorage(id),
    };
  }

  protected async getTrigger(id: string) {
    return (await this.triggersStorage.getItem(id)) as ITrigger | undefined;
  }

  protected createTriggerDataStorage(id: string) {
    return new SubTreeJsonPluginStorage(new SubTreeJsonPluginStorage(this.triggersStorage, id), 'data');
  }

  async getTriggerList(): Promise<ITrigger[]> {
    const triggersDict = (await this.triggersStorage.getItem(null)) || {};
    return values(triggersDict).map((t) => {
      return {
        id: t.id,
        schemaRef: t.schemaRef,
        triggerData: this.createTriggerDataStorage(t.id),
      };
    });
  }

  getTriggerSchemaList(): ITriggerSchema[] {
    return this.component.triggers || [];
  }

  async removeTrigger(triggerId: string): Promise<void> {
    const trigger = await this.getTrigger(triggerId);
    if (trigger) {
      await this.triggersStorage.deleteItem(triggerId);
    }
  }
}
