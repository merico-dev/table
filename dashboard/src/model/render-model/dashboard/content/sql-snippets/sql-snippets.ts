import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { CURRENT_SCHEMA_VERSION, SQLSnippetMetaSnapshotIn } from '~/model';
import { downloadJSON } from '~/utils/download';
import { SQLSnippetRenderModel } from './sql-snippet';

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

    findByKeySet(keySet: Set<string>) {
      return self.current.filter((s) => keySet.has(s.key));
    },
  }))
  .actions((self) => ({
    getSchema(keys: string[]) {
      const sqlSnippets = self.findByKeySet(new Set(keys));

      const ret = {
        definition: {
          sqlSnippets: sqlSnippets.map((s) => s.json),
        },
        version: CURRENT_SCHEMA_VERSION,
      };
      return ret;
    },
    downloadSchema(keys: string[]) {
      const schema = JSON.stringify(this.getSchema(keys), null, 2);
      const filename = 'SQL Snippets';
      downloadJSON(filename, schema);
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
