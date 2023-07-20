import { IServiceLocator } from '~/components/plugins/service/service-locator';
import { IVizOperationManager, IVizTriggerManager, VizInstance } from '~/types/plugin';

import { tokens } from '../plugin-context';
import { IVizManager } from '../viz-manager';
import { PanelModelInstance } from '~/model/panels';

export enum MigrationResultType {
  migrated = 'migrated',
  nothingToMigrate = 'nothingToMigrate',
  checkFailed = 'checkFailed',
  migrationFailed = 'migrationFailed',
}

export enum MigrationStatus {
  notStarted = 'notStarted',
  inProgress = 'inProgress',
  done = 'done',
}

export class InstanceMigrator {
  protected vizInstance: VizInstance;
  protected operationManager: IVizOperationManager;
  protected triggerManager: IVizTriggerManager;
  protected vizManager: IVizManager;
  protected runningMigration?: Promise<MigrationResultType>;
  protected panelModel: PanelModelInstance;
  status: MigrationStatus = MigrationStatus.notStarted;

  constructor(serviceLocator: IServiceLocator) {
    this.panelModel = serviceLocator.getRequired(tokens.instanceScope.panelModel);
    this.vizInstance = serviceLocator.getRequired(tokens.instanceScope.vizInstance);
    this.operationManager = serviceLocator.getRequired(tokens.instanceScope.operationManager);
    this.triggerManager = serviceLocator.getRequired(tokens.instanceScope.triggerManager);
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
      return MigrationResultType.nothingToMigrate;
    }
    try {
      await Promise.all(tasks.map((t) => t()));
      return MigrationResultType.migrated;
    } catch (e) {
      console.warn('migration failed', e);
      return MigrationResultType.migrationFailed;
    }
  }

  async runMigration(): Promise<MigrationResultType> {
    if (!this.runningMigration) {
      this.status = MigrationStatus.inProgress;
      this.runningMigration = this.createMigrationTask().then((r) => {
        this.status = MigrationStatus.done;
        return r;
      });
    }
    return this.runningMigration;
  }

  protected async runInteractionMigration() {
    // when a new instance scoped service is need, we should refactor this
    await this.operationManager.runMigration();
    await this.triggerManager.runMigration();
  }

  protected async runInstanceMigration() {
    const comp = this.vizManager.resolveComponent(this.vizInstance.type);
    const migrationCtx = { configData: this.vizInstance.instanceData, panelModel: this.panelModel };
    await comp.migrator.migrate(migrationCtx);
  }

  private async instanceNeedMigration() {
    const comp = this.vizManager.resolveComponent(this.vizInstance.type);
    const migrationCtx = { configData: this.vizInstance.instanceData };
    return comp.migrator.needMigration(migrationCtx);
  }

  private async interactionNeedMigration() {
    return (await this.operationManager.needMigration()) || (await this.triggerManager.needMigration());
  }
}

// todo: add tests
