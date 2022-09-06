import { ITrigger, ITriggerSchema, IVizTriggerManager, VizComponent, VizInstance } from '../../types/plugin';

export class VizTriggerManager implements IVizTriggerManager {
  constructor(protected instance: VizInstance, protected component: VizComponent) {}

  async addTrigger(trigger: ITrigger): Promise<void> {
    if (!(await this.validateTrigger(trigger))) {
      return;
    }
    const triggers = await this.getTriggerList();
    triggers.push(trigger);
    await this.saveTriggers(triggers);
  }

  protected async validateTrigger(trigger: ITrigger) {
    const schema = trigger.schemaRef;
    const schemaList = this.getTriggerSchemaList();
    // is schema valid
    if (!schemaList.some((s) => s.id === schema)) {
      console.warn(`Trigger schema '${schema}' is not defined in component '${this.component.name}'`);
      return false;
    }
    // is trigger id duplicated
    const triggers = await this.getTriggerList();
    if (triggers.some((t) => t.id === trigger.id)) {
      console.warn(`Trigger id '${trigger.id}' is duplicated`);
      return false;
    }
    return true;
  }

  protected async saveTriggers(triggers: ITrigger[]) {
    const instanceData = this.instance.instanceData;
    await instanceData.setItem('__TRIGGERS', triggers);
  }

  async getTriggerList(): Promise<ITrigger[]> {
    return (await this.instance.instanceData.getItem('__TRIGGERS')) || [];
  }

  getTriggerSchemaList(): ITriggerSchema[] {
    return this.component.triggers || [];
  }

  async removeTrigger(triggerId: string): Promise<void> {
    const triggers = await this.getTriggerList();
    await this.saveTriggers(triggers.filter((t) => t.id !== triggerId));
  }
}
