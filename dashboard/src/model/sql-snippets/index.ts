import _ from 'lodash';
import { types, cast } from 'mobx-state-tree';
import { SQLSnippetModel, SQLSnippetModelInstance } from './sql-snippet';

export const SQLSnippetsModel = types
  .model('SQLSnippetsModel', {
    original: types.optional(types.array(SQLSnippetModel), []),
    current: types.optional(types.array(SQLSnippetModel), []),
  })
  .views((self) => ({
    get changed() {
      return !_.isEqual(self.original, self.current);
    },
    get json() {
      return self.current.map((o) => o.json);
    },
  }))
  .actions((self) => {
    return {
      reset() {
        self.current = _.cloneDeep(self.original);
      },
      replace(current: Array<SQLSnippetModelInstance>) {
        self.current = cast(current);
      },
      append(item: SQLSnippetModelInstance) {
        self.current.push(item);
      },
      remove(index: number) {
        self.current.splice(index, 1);
      },
      replaceByIndex(index: number, replacement: SQLSnippetModelInstance) {
        self.current.splice(index, 1, replacement);
      },
    };
  });

export * from './sql-snippet';
