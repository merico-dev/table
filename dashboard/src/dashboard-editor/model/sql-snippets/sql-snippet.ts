import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { SQLSnippetsModelInstance } from './types';
import { SQLSnippetMeta } from '~/model';

export const SQLSnippetModel = SQLSnippetMeta.views((self) => ({
  isADuplicatedKey(newKey: string) {
    if (!newKey) {
      return false;
    }
    if (newKey === self.key) {
      return false;
    }
    const parent = getParent<SQLSnippetsModelInstance>(self, 2);
    const match = parent.findByKey(newKey);
    if (match) {
      return true;
    }
    return false;
  },
}));

export type SQLSnippetModelInstance = Instance<typeof SQLSnippetModel>;
export type SQLSnippetModelSnapshotIn = SnapshotIn<SQLSnippetModelInstance>;
