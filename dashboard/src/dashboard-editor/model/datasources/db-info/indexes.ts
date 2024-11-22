import { types } from 'mobx-state-tree';

export type MYSQLIndexInfoType = {
  index_length: string;
  index_name: string;
  index_algorithm: string;
  is_unique: boolean;
  column_name: string;
};

export type PGIndexInfoType = {
  index_name: string;
  index_algorithm: string;
  is_unique: boolean;
  index_definition: string;
  condition: string;
  comment: string;
};

export type IndexInfoType = PGIndexInfoType | MYSQLIndexInfoType;

export const IndexesModel = types
  .model({
    data: types.optional(types.frozen<IndexInfoType[]>(), []),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .views((self) => ({
    get loading() {
      return self.state === 'loading';
    },
    get empty() {
      return self.data.length === 0;
    },
  }));
