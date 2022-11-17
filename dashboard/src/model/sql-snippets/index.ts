import { cast, types } from 'mobx-state-tree';
import { SQLSnippetModel, SQLSnippetModelInstance } from './sql-snippet';

export const SQLSnippetsModel = types
  .model('SQLSnippetsModel', {
    current: types.optional(types.array(SQLSnippetModel), []),
  })
  .views((self) => ({
    get json() {
      return self.current.map((o) => o.json);
    },
    get record() {
      return self.current.reduce((prev, curr) => {
        prev[curr.key] = curr.value;
        return prev;
      }, {} as Record<string, string>);
    },
  }))
  .actions((self) => {
    return {
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
