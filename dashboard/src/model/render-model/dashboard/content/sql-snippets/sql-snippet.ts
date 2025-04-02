import { getParent, Instance, SnapshotIn } from 'mobx-state-tree';
import { SQLSnippetMeta, type ISQLSnippetMeta } from '~/model';
import { SQLSnippetsRenderModelInstance } from './types';
import { typeAssert } from '~/types/utils';

export const SQLSnippetRenderModel = SQLSnippetMeta.views((self) => ({
  isADuplicatedKey(newKey: string) {
    if (!newKey) {
      return false;
    }
    if (newKey === self.key) {
      return false;
    }
    const parent = getParent<SQLSnippetsRenderModelInstance>(self, 2);
    const match = parent.findByKey(newKey);
    if (match) {
      return true;
    }
    return false;
  },
}));

export type SQLSnippetRenderModelInstance = Instance<typeof SQLSnippetRenderModel>;
export type SQLSnippetRenderModelSnapshotIn = SnapshotIn<SQLSnippetRenderModelInstance>;

export interface ISQLSnippetRenderModel extends ISQLSnippetMeta {
  isADuplicatedKey(newKey: string): boolean;
}

typeAssert.shouldExtends<ISQLSnippetRenderModel, SQLSnippetRenderModelInstance>();

export type SQLSnippetUsageType = { queryID: string; sqlSnippetKey: string; queryName: string };
