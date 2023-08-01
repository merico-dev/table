import { types } from 'mobx-state-tree';

export const GlobalSQLSnippetMeta = types.model({
  id: types.string,
  content: types.string,
  create_time: types.string,
  update_time: types.string,
  is_preset: types.boolean,
});
