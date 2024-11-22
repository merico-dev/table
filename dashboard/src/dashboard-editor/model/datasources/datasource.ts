import { Instance, types } from 'mobx-state-tree';
import { DataSourceMetaModel } from '~/model/meta-model/datasources';
import { DBInfoModel } from './db-info';

export const DataSourceModel = types.compose(
  'DataSourceModel',
  DataSourceMetaModel,
  types.model({
    dbInfo: types.optional(DBInfoModel, {}),
  }),
);

export type DataSourceModelInstance = Instance<typeof DataSourceModel>;
