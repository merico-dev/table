import { ITreeDataQueryOption } from '../types';
import { arrayToTree } from 'performant-array-to-tree';

export function queryDataToTree(queryData: ITreeDataQueryOption[]) {
  const tree = arrayToTree(queryData, {
    id: 'value',
    parentId: 'parent_value',
    childrenField: 'children',
    dataField: null,
  });
  return tree;
}
