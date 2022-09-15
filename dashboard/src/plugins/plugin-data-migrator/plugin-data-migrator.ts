import { last, orderBy } from 'lodash';

interface IMigration {
  version: number;
  handler: (data: $TSFixMe) => $TSFixMe;
}

export class PluginDataMigrator {
  protected migrations: IMigration[] = [];

  version(version: number, handler: (data: $TSFixMe) => $TSFixMe): PluginDataMigrator {
    this.migrations.push({ version, handler });
    return this;
  }

  run(migrationTarget: { from: number; to: number }, val: $TSFixMe) {
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
    return orderedMigrations.reduce((acc, m) => m.handler(acc), val);
  }
}
