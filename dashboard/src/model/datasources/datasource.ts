import { types } from 'mobx-state-tree';
import { DataSourceType } from '../queries/types';
import { TDataSourceConfig } from '~/api-caller/types';

export const DataSourceModel = types
  .model('DataSourceModel', {
    id: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.HTTP, DataSourceType.MySQL, DataSourceType.Postgresql]),
    key: types.string,
    config: types.frozen<TDataSourceConfig>(),
  })
  .views((self) => ({}))
  .actions((self) => ({}));
