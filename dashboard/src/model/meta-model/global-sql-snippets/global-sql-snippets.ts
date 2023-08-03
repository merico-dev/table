import { types } from 'mobx-state-tree';
import { GlobalSQLSnippetDBType } from '~/api-caller';
import { GlobalSQLSnippetMeta } from './global-sql-snippet';

export const GlobalSQLSnippetsMeta = types
  .model('GlobalSQLSnippetsMeta', {
    list: types.optional(types.array(GlobalSQLSnippetMeta), []),
  })
  .views((self) => ({
    find(id: string) {
      return self.list.find((i) => i.id === id);
    },
    get options() {
      return self.list.map((d) => ({
        value: d.id,
        label: d.id,
      }));
    },
  }))
  .actions((self) => ({
    replace(list: GlobalSQLSnippetDBType[]) {
      self.list.length = 0;
      self.list.push(...list);
    },
  }));

export type GlobalSQLSnippetsMetaType = typeof GlobalSQLSnippetsMeta;
