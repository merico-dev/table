import { Instance, types } from 'mobx-state-tree';
import { TDataSourceConfig } from '~/api-caller/types';
import { DataSourceType } from '~/model';

export const DataSourceMetaModel = types.model('DataSourceMetaModel', {
  id: types.string,
  type: types.enumeration('DataSourceType', [DataSourceType.HTTP, DataSourceType.MySQL, DataSourceType.Postgresql]),
  key: types.string,
  config: types.frozen<TDataSourceConfig>(),
});

export type DataSourceMetaModelInstance = Instance<typeof DataSourceMetaModel>;
