import {
  IDashboardOperation,
  IDashboardOperationSchema,
  ITrigger,
  IVizInteraction,
  IVizInteractionManager,
  IVizOperationManager,
  IVizTriggerManager,
  PluginStorage,
  VizComponent,
  VizInstance,
} from '../types/plugin';
import { AttachmentInstanceManager } from './attachment-instance-manager';
import { OperationManager } from './operation/operation-manager-impl';
import { VizTriggerManager } from './trigger/trigger-manager-impl';

export class InteractionManager implements IVizInteractionManager {
  operationManager: IVizOperationManager;
  triggerManager: IVizTriggerManager;
  attachments: AttachmentInstanceManager<IVizInteraction>;

  constructor(instance: VizInstance, component: VizComponent, operations?: IDashboardOperationSchema[]) {
    this.operationManager = new OperationManager(instance, operations);
    this.triggerManager = new VizTriggerManager(instance, component);
    const constructInstance = async (storage: PluginStorage): Promise<IVizInteraction> => {
      const { id, triggerRef, operationRef } = await storage.getItem(null);
      return {
        id,
        triggerRef,
        operationRef,
      };
    };
    this.attachments = new AttachmentInstanceManager(instance, '__INTERACTIONS', constructInstance);
  }

  async addInteraction(trigger: ITrigger, operation: IDashboardOperation): Promise<void> {
    const triggerRef = trigger.id;
    const operationRef = operation.id;
    const interactionId = `[${triggerRef}]:[${operationRef}]`;
    await this.attachments.create(interactionId, {
      id: interactionId,
      triggerRef,
      operationRef,
    });
  }

  getInteractionList(): Promise<IVizInteraction[]> {
    return this.attachments.list();
  }

  async removeInteraction(interactionId: string): Promise<void> {
    const interaction = await this.attachments.getInstance(interactionId);
    if (!interaction) {
      return;
    }

    const { triggerRef, operationRef } = interaction;
    if ((await this.getTriggerRefCount(triggerRef)) <= 1) {
      await this.triggerManager.removeTrigger(triggerRef);
    }
    if ((await this.getOperationRefCount(operationRef)) <= 1) {
      await this.operationManager.removeOperation(operationRef);
    }
    await this.attachments.remove(interactionId);
  }

  protected async getOperationRefCount(operationRef: string) {
    const interactionList = await this.getInteractionList();
    return interactionList.filter((i) => i.operationRef === operationRef).length;
  }

  protected async getTriggerRefCount(triggerRef: string) {
    const interactionList = await this.getInteractionList();
    return interactionList.filter((i) => i.triggerRef === triggerRef).length;
  }

  async runInteraction(triggerId: string, payload: Record<string, unknown>): Promise<void> {
    const interactionList = await this.getInteractionList();
    const affectedInteractions = interactionList.filter((i) => i.triggerRef === triggerId);
    await Promise.all(
      affectedInteractions.map(async (it) => {
        try {
          return await this.operationManager.runOperation(it.operationRef, payload);
        } catch (e) {
          console.warn(`Failed to run operation '${it.operationRef}'`, e);
        }
      }),
    );
  }
}
