import { JsonPluginStorage } from '~/components/plugins/json-plugin-storage';
import {
  IDashboardOperation,
  IDashboardOperationSchema,
  ITrigger,
  ITriggerSchema,
  IVizInteraction,
  IVizInteractionManager,
  IVizOperationManager,
  IVizTriggerManager,
  PluginStorage,
} from '~/types/plugin';

class NullTriggerManager implements IVizTriggerManager {
  getTriggerSchemaList(): ITriggerSchema[] {
    return [];
  }
  getTriggerList(): Promise<ITrigger[]> {
    return Promise.resolve([]);
  }
  removeTrigger(): Promise<void> {
    return Promise.resolve();
  }
  createOrGetTrigger(): Promise<ITrigger> {
    return Promise.resolve(nullTrigger);
  }
  retrieveTrigger(): Promise<ITrigger | undefined> {
    return Promise.resolve(nullTrigger);
  }
  watchTriggerSnapshotList(): () => void {
    return () => {
      return;
    };
  }
  needMigration(): Promise<boolean> {
    return Promise.resolve(false);
  }
  runMigration(): Promise<void> {
    return Promise.resolve();
  }
}

class NullTrigger implements ITrigger {
  id = '';
  schemaRef = '';
  triggerData: PluginStorage = new JsonPluginStorage({});
}
const nullTrigger = new NullTrigger();

class NullOperationManager implements IVizOperationManager {
  getOperationSchemaList(): IDashboardOperationSchema[] {
    return [];
  }
  getOperationList(): Promise<IDashboardOperation[]> {
    return Promise.resolve([]);
  }
  removeOperation(): Promise<void> {
    return Promise.resolve();
  }
  createOrGetOperation(): Promise<IDashboardOperation> {
    return Promise.resolve(nullOperation);
  }
  runOperation(): Promise<void> {
    return Promise.resolve();
  }
  retrieveTrigger(): Promise<IDashboardOperation | undefined> {
    return Promise.resolve(nullOperation);
  }
  runMigration(): Promise<void> {
    return Promise.resolve();
  }
  needMigration(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

class NullDashboardOperation implements IDashboardOperation {
  id = '';
  schemaRef = '';
  operationData: PluginStorage = new JsonPluginStorage({});
}
const nullOperation = new NullDashboardOperation();

export class NullInteractionManager implements IVizInteractionManager {
  triggerManager: IVizTriggerManager = new NullTriggerManager();
  operationManager: IVizOperationManager = new NullOperationManager();
  getInteractionList(): Promise<IVizInteraction[]> {
    return Promise.resolve([]);
  }
  addInteraction(): Promise<void> {
    return Promise.resolve();
  }
  removeInteraction(): Promise<void> {
    return Promise.resolve();
  }
  runInteraction(): Promise<void> {
    return Promise.resolve();
  }

  static instance = new NullInteractionManager();
}
