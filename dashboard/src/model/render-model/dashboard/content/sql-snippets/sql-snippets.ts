import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { SQLSnippetRenderModel } from './sql-snippet';
import { SQLSnippetMetaSnapshotIn } from '~/model';

export const SQLSnippetsRenderModel = types
  .model('SQLSnippetsRenderModel', {
    current: types.optional(types.array(SQLSnippetRenderModel), []),
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
    get keySet() {
      return new Set(self.current.map((o) => o.key));
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
  }));

export type SQLSnippetsRenderModelSnapshotIn = SnapshotIn<Instance<typeof SQLSnippetsRenderModel>>;

export function getInitialSQLSnippetsRenderModel(
  snippets: SQLSnippetMetaSnapshotIn[],
): SQLSnippetsRenderModelSnapshotIn {
  return {
    current: snippets,
  };
}
