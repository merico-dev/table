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

  constructor(instance: VizInstance) {
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
    return OPERATIONS;
  }

  removeOperation(operationId: string): Promise<void> {
    return this.attachments.remove(operationId);
  }
}
