import { SubTreeJsonPluginStorage } from '../../plugins/sub-tree-json-plugin-storage';
import {
  IDashboardOperation,
  IDashboardOperationSchema,
  IVizOperationManager,
  PluginStorage,
  VizInstance,
} from '../../types/plugin';
import { AttachmentInstanceManager } from '../attachment-instance-manager';
import { OPERATIONS } from './operations';

export class OperationManager implements IVizOperationManager {
  protected attachments: AttachmentInstanceManager<IDashboardOperation>;

  constructor(instance: VizInstance, protected operations: IDashboardOperationSchema[] = OPERATIONS) {
    const constructInstance = async (storage: PluginStorage) => {
      const { id, schemaRef } = await storage.getItem(null);
      return {
        id,
        schemaRef,
        operationData: new SubTreeJsonPluginStorage(storage, 'data'),
      };
    };
    this.attachments = new AttachmentInstanceManager(instance, '__OPERATIONS', constructInstance);
  }

  async runOperation(operationId: string, payload: Record<string, unknown>): Promise<void> {
    const operation = await this.attachments.getInstance(operationId);
    if (!operation) {
      console.warn(`Operation '${operationId}' is not defined`);
      return;
    }
    const schema = this.operations.find((s) => s.id === operation.schemaRef);
    if (!schema) {
      console.warn(`Operation schema '${operation.schemaRef}' is not defined`);
      return;
    }
    await schema.run(payload, operation.operationData);
  }

  async createOrGetOperation(id: string, schema: IDashboardOperationSchema): Promise<IDashboardOperation> {
    const schemaList = this.getOperationSchemaList();
    if (!schemaList.some((s) => s.id === schema.id)) {
      throw new Error(`Operation schema '${schema.id}' is not defined`);
    }
    const operation = await this.attachments.getInstance(id);
    const shouldRecreate = !operation || operation.schemaRef !== schema.id;
    if (shouldRecreate) {
      return await this.attachments.create(id, {
        id,
        schemaRef: schema.id,
        data: {},
      });
    }
    return operation;
  }

  getOperationList(): Promise<IDashboardOperation[]> {
    return this.attachments.list();
  }

  getOperationSchemaList(): IDashboardOperationSchema[] {
    return this.operations;
  }

  removeOperation(operationId: string): Promise<void> {
    return this.attachments.remove(operationId);
  }
}
