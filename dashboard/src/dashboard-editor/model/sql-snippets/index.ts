import _ from 'lodash';
import { cast, detach, Instance } from 'mobx-state-tree';
import { SQLSnippetRenderModelInstance, SQLSnippetRenderModelSnapshotIn, SQLSnippetsRenderModel } from '~/model';

export const SQLSnippetsModel = SQLSnippetsRenderModel.views((self) => ({
  get sortedList() {
    return _.sortBy(self.current, (o) => o.key.toLowerCase());
  },
  get options() {
    const options = self.current.map(
      (o) =>
        ({
          label: o.key,
          value: o.key,
          _type: 'sql_snippet',
        } as const),
    );
    return _.sortBy(options, (o) => o.label.toLowerCase());
  },
})).actions((self) => {
  return {
    replace(current: Array<SQLSnippetRenderModelInstance>) {
      self.current = cast(current);
    },
    append(item: SQLSnippetRenderModelSnapshotIn) {
      self.current.push(item);
    },

    appendMultiple(items: SQLSnippetRenderModelSnapshotIn[]) {
      if (items.length === 0) {
        return;
      }

      const newItems = items.filter((item) => !self.keySet.has(item.key));
      self.current.push(...newItems);
    },
    remove(index: number) {
      self.current.splice(index, 1);
    },
    removeByKey(key: string) {
      const index = self.current.findIndex((s) => s.key === key);
      if (index >= 0) {
        self.current.splice(index, 1);
      }
    },
    removeByKeys(keys: string[]) {
      const set = new Set(keys);
      self.current.forEach((s) => {
        if (set.has(s.key)) {
          detach(s);
        }
      });
      const list = [...self.current];
      _.remove(list, (s) => set.has(s.key));
      self.current = cast(list);
    },
    replaceByIndex(index: number, replacement: SQLSnippetRenderModelSnapshotIn) {
      self.current.splice(index, 1, replacement);
    },
  };
});

export type SQLSnippetsModelInstance = Instance<typeof SQLSnippetsModel>;
