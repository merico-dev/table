import { last, orderBy } from 'lodash';
import { TRIGGERS_KEY } from '~/interactions';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { AnyObject } from '~/types';

export interface IMigrationEnv {
  panelModel: PanelModelInstance;
}

export interface IInitialMigrationRet {
  version: 1;
  config: any;
}

export interface IMigrationData {
  config: any;
  [TRIGGERS_KEY]: AnyObject;
  __INTERACTIONS: AnyObject;
  __OPERATIONS: AnyObject;
}

export interface IMigration {
  version: number;
  handler: (data: IMigrationData, env: IMigrationEnv) => IMigrationData | IInitialMigrationRet;
}

export class PluginDataMigrator {
  protected migrations: IMigration[] = [];

  version(version: number, handler: IMigration['handler']): PluginDataMigrator {
    this.migrations.push({ version, handler });
    return this;
  }

  run(migrationTarget: { from: number; to: number }, val: $TSFixMe, env: IMigrationEnv): $TSFixMe {
    if (migrationTarget.from === migrationTarget.to) {
      return val;
    }
    if (migrationTarget.from > migrationTarget.to) {
      throw new Error(`Can not downgrade from version '${migrationTarget.from}' to (${migrationTarget.to})`);
    }
    const migrationsToRun = this.migrations.filter(
      (m) => m.version > migrationTarget.from && m.version <= migrationTarget.to,
    );
    const orderedMigrations = orderBy(migrationsToRun, 'version', 'asc');
    if (last(orderedMigrations)?.version !== migrationTarget.to) {
      throw new Error(`Migration to version ${migrationTarget.to} not found`);
    }
    return orderedMigrations.reduce((acc, m) => m.handler(acc, env), val);
  }
}
