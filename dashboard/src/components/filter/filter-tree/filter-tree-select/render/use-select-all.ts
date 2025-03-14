import _ from 'lodash';
import { TreeItem } from 'performant-array-to-tree';
import { useMemo } from 'react';

export const useSelectAll = (
  treeData: TreeItem[],
  value: TreeItem[],
  onChange: (v: TreeItem[]) => void,
  treeCheckStrictly: boolean,
) => {
  const allOptions = useMemo(() => {
    if (!treeCheckStrictly) {
      return _.cloneDeep(treeData.filter((t) => !t.disabled));
    }

    const ret: TreeItem[] = [];
    const trav = (o: TreeItem) => {
      if (!o.disabled) {
        ret.push(o);
      }
      o.children.forEach(trav);
    };
    treeData.forEach(trav);
    return ret;
  }, [treeData, treeCheckStrictly]);

  const allValueSet = useMemo(() => new Set(allOptions.map((o) => o.value)), [allOptions]);

  const selectedValueSet = useMemo(() => {
    return new Set(value.map((v) => v.value));
  }, [value]);

  const allSelected = useMemo(() => {
    console.log(selectedValueSet, allValueSet);
    if (selectedValueSet.size !== allValueSet.size) {
      return false;
    }
    return Array.from(allValueSet).every((v) => selectedValueSet.has(v));
  }, [selectedValueSet, allValueSet]);

  const toggleSelectAll = () => {
    console.log(allSelected);
    if (allSelected) {
      onChange([]);
      return;
    }
    const newValue = Array.from(allOptions);
    onChange(newValue);
  };

  return {
    allValueSet,
    selectedValueSet,
    toggleSelectAll,
    allSelected,
  };
};
