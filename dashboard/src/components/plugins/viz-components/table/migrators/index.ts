import { randomId } from '@mantine/hooks';
import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import * as Handlers from '../migrators/handlers';
import { ITableConf } from '../type';

export class VizTableMigrator extends VersionBasedMigrator {
  readonly VERSION = 7;

  configVersions(): void {
    // @ts-expect-error data's type
    this.version(1, (data: Record<string, unknown>) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { columns, ...rest } = data.config as ITableConf;
      return {
        ...data,
        version: 2,
        config: {
          ...rest,
          columns: columns.map(({ id, ...restColumn }) => ({
            id: id ?? randomId(),
            ...restColumn,
          })),
        },
      };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: Handlers.v3(data.config),
      };
    });
    this.version(4, (data, env) => {
      return {
        ...data,
        version: 4,
        config: Handlers.v4(data.config, env),
      };
    });
    this.version(5, (data) => {
      return {
        ...data,
        version: 5,
        config: Handlers.v5(data.config),
      };
    });
    this.version(6, (data) => {
      return {
        ...data,
        version: 6,
        config: Handlers.v6(data.config),
      };
    });
    this.version(7, (data) => {
      return {
        ...data,
        version: 7,
        config: Handlers.v7(data.config),
      };
    });
  }
}
