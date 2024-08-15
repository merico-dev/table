import { arrayToTree } from 'performant-array-to-tree';
import { ITreeDataRenderItem } from '../types';

export function queryDataToTree(queryData: ITreeDataRenderItem[]) {
  const tree = arrayToTree(queryData, {
    id: 'value',
    parentId: 'parent_value',
    childrenField: 'children',
    dataField: null,
  });
  return tree;
}
