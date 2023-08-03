import { SubTreeJsonPluginStorage } from '~/components/plugins/sub-tree-json-plugin-storage';
import {
  IConfigMigrationContext,
  IDashboardOperation,
  IDashboardOperationSchema,
  IVizOperationManager,
  PluginStorage,
  VizInstance,
} from '~/types/plugin';
import { AttachmentInstanceManager } from '../attachment-instance-manager';
import { OPERATIONS } from './operations';

export class OperationManager implements IVizOperationManager {
  protected attachments: AttachmentInstanceManager<IDashboardOperation>;

  constructor(instance: VizInstance, protected operations: IDashboardOperationSchema[] = OPERATIONS) {
    const constructInstance = async (storage: PluginStorage) => {
      const { id, schemaRef } = await storage.getItem<Omit<IDashboardOperation, 'operationData'>>(null);
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
    const schema = this.tryGetSchema(operation.schemaRef);
    if (!schema) {
      console.warn(`Operation schema '${operation.schemaRef}' is not defined`);
      return;
    }
    await schema.run(payload, operation);
  }

  private tryGetSchema(schemaRef: string) {
    return this.operations.find((s) => s.id === schemaRef);
  }

  async needMigration(): Promise<boolean> {
    const instances = await this.attachments.list();
    const tasks = instances.map(async (instance) => {
      const migrationContext: IConfigMigrationContext = {
        configData: instance.operationData,
      };
      const schema = this.tryGetSchema(instance.schemaRef);
      const migrator = schema?.migrator;
      return migrator && (await migrator.needMigration(migrationContext));
    });
    return (await Promise.all(tasks)).some((need) => need);
  }

  async runMigration() {
    const instances = await this.attachments.list();
    const tasks = instances.map(async (instance) => {
      const migrationContext: IConfigMigrationContext = {
        configData: instance.operationData,
      };
      const schema = this.tryGetSchema(instance.schemaRef);
      const migrator = schema?.migrator;
      if (migrator && (await migrator.needMigration(migrationContext))) {
        await migrator.migrate(migrationContext);
      }
    });
    await Promise.all(tasks);
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
        data: schema.createDefaultConfig?.() ?? {},
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

  async retrieveTrigger(operationId: string): Promise<IDashboardOperation | undefined> {
    return await this.attachments.getInstance(operationId);
  }
}
