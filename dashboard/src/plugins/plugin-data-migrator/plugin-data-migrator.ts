import { last, orderBy } from 'lodash';
import { PanelModelInstance } from '~/model/views/view/panels';

export interface IMigrationEnv {
  panelModel: PanelModelInstance;
}

export interface IMigration {
  version: number;
  handler: (data: $TSFixMe, env: IMigrationEnv) => $TSFixMe;
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
