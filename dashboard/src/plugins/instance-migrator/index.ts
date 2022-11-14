import { IServiceLocator } from '~/service-locator';
import { IVizOperationManager, VizInstance } from '~/types/plugin';

import { IVizManager } from '../viz-manager';
import { tokens } from '../plugin-context';

export enum MigrationResultType {
  migrated = 'migrated',
  nothingToMigrate = 'nothingToMigrate',
  checkFailed = 'checkFailed',
  migrationFailed = 'migrationFailed',
}

export class InstanceMigrator {
  protected vizInstance: VizInstance;
  protected operationManager: IVizOperationManager;
  protected vizManager: IVizManager;
  protected runningMigration?: Promise<MigrationResultType>;
  migrated = false;

  constructor(serviceLocator: IServiceLocator) {
    this.vizInstance = serviceLocator.getRequired(tokens.instanceScope.vizInstance);
    this.operationManager = serviceLocator.getRequired(tokens.instanceScope.operationManager);
    this.vizManager = serviceLocator.getRequired(tokens.vizManager);
  }

  async createMigrationTask() {
    const tasks: (() => Promise<void>)[] = [];
    try {
      if (await this.instanceNeedMigration()) {
        tasks.push(() => this.runInstanceMigration());
      }
      if (await this.interactionNeedMigration()) {
        tasks.push(() => this.runInteractionMigration());
      }
    } catch (e) {
      console.warn('check migration failed', e);
      return MigrationResultType.checkFailed;
    }
    if (tasks.length === 0) {
      this.migrated = true;
      return MigrationResultType.nothingToMigrate;
    }
    try {
      await Promise.all(tasks.map((t) => t()));
      this.migrated = true;
      return MigrationResultType.migrated;
    } catch (e) {
      console.warn('migration failed', e);
      return MigrationResultType.migrationFailed;
    }
  }

  async runMigration(): Promise<MigrationResultType> {
    if (!this.runningMigration) {
      this.runningMigration = this.createMigrationTask();
    }
    return this.runningMigration;
  }

  protected async runInteractionMigration() {
    return this.operationManager.runMigration();
  }

  protected async runInstanceMigration() {
    const comp = this.vizManager.resolveComponent(this.vizInstance.type);
    const migrationCtx = { configData: this.vizInstance.instanceData };
    await comp.migrator.migrate(migrationCtx);
  }

  private async instanceNeedMigration() {
    const comp = this.vizManager.resolveComponent(this.vizInstance.type);
    const migrationCtx = { configData: this.vizInstance.instanceData };
    return comp.migrator.needMigration(migrationCtx);
  }

  private async interactionNeedMigration() {
    // todo: add migration to trigger
    return this.operationManager.needMigration();
  }
}

// todo: add tests
