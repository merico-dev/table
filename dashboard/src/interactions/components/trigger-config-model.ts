import { useCreation } from 'ahooks';
import { makeAutoObservable, runInAction } from 'mobx';
import { Ready } from '~/types';
import { ITrigger, ITriggerSchema, IVizTriggerManager, VizInstance } from '~/types/plugin';

export class TriggerConfigModel {
  triggerId?: string;
  trigger?: ITrigger;
  triggerSchema?: ITriggerSchema;
  sampleData?: TPanelData;

  get schemaList() {
    return this.triggerManager.getTriggerSchemaList();
  }

  async configTrigger(triggerId: string, sampleData: TPanelData) {
    const trigger = await this.triggerManager.retrieveTrigger(triggerId);
    const schema = this.triggerManager.getTriggerSchemaList().find((it) => it.id === trigger?.schemaRef);
    runInAction(() => {
      this.triggerId = triggerId;
      this.trigger = trigger;
      this.triggerSchema = schema;
      this.sampleData = sampleData;
    });
  }

  async changeSchema(schema: ITriggerSchema) {
    if (this.triggerId) {
      await this.triggerManager.createOrGetTrigger(this.triggerId, schema);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.configTrigger(this.triggerId, this.sampleData!);
    }
  }

  isReady(): this is ReadyTriggerConfigModel {
    return isReady(this);
  }

  constructor(public triggerManager: IVizTriggerManager, public instance: VizInstance) {
    makeAutoObservable(this);
  }
}

export type ReadyTriggerConfigModel = Ready<TriggerConfigModel, 'trigger' | 'triggerSchema' | 'sampleData'>;

export function isReady(model: TriggerConfigModel): model is ReadyTriggerConfigModel {
  return !!model.triggerId && !!model.triggerSchema;
}

export function useTriggerConfigModel(triggerManager: IVizTriggerManager, instance: VizInstance) {
  return useCreation(() => new TriggerConfigModel(triggerManager, instance), [triggerManager, instance]);
}
