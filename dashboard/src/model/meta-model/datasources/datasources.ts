import { types } from 'mobx-state-tree';
import { IDataSource } from '~/api-caller/types';
import { DataSourceType } from '~/model';
import { DataSourceMetaModel } from './datasource';

export const DataSourcesMetaModel = types
  .model('DataSourcesMetaModel', {
    list: types.optional(types.array(DataSourceMetaModel), []),
  })
  .views((self) => ({
    find({ type, key }: { type: DataSourceType; key: string }) {
      return self.list.find((i) => i.key === key && i.type === type);
    },
    get options() {
      return self.list.map((d) => ({
        value: d.key,
        label: d.key,
      }));
    },
  }))
  .actions((self) => ({
    replace(list: IDataSource[]) {
      self.list.length = 0;
      self.list.push(...list);
    },
  }));

export type DataSourcesMetaModelType = typeof DataSourcesMetaModel;
