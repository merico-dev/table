import { cast, Instance, types } from 'mobx-state-tree';
import { SQLSnippetModel, SQLSnippetModelInstance } from './sql-snippet';

export const SQLSnippetsModel = types
  .model('SQLSnippetsModel', {
    current: types.optional(types.array(SQLSnippetModel), []),
  })
  .views((self) => ({
    get json() {
      return self.current.map((o) => o.json);
    },
    get options() {
      return self.current.map(
        (o) =>
          ({
            label: o.key,
            value: o.key,
            _type: 'sql_snippet',
          } as const),
      );
    },
    get record() {
      return self.current.reduce((prev, curr) => {
        prev[curr.key] = curr.value;
        return prev;
      }, {} as Record<string, string>);
    },
    get firstKey() {
      if (self.current.length === 0) {
        return undefined;
      }
      return self.current[0].key;
    },
    findByKey(key: string) {
      return self.current.find((item) => item.key === key);
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

export type SQLSnippetsModelInstance = Instance<typeof SQLSnippetsModel>;
export * from './sql-snippet';
