import { addDisposer, cast, Instance, types, getRoot, getParent } from 'mobx-state-tree';
import { Text, TextProps } from '@mantine/core';
import { FilterConfigModel_BaseSelect } from './select-base';
import { ITreeDataQueryOption, ITreeDataRenderItem } from '~/filter/filter-tree-select/types';
import React from 'react';
import { queryDataToTree } from '~/filter/filter-tree-select/render/query-data-to-tree';
import { reaction } from 'mobx';

function addLabelToData(data: ITreeDataQueryOption[]) {
  return data.map((d) => {
    const { label, description, ...rest } = d;
    const ret: ITreeDataRenderItem = {
      ...rest,
      filterBasis: `${label}___${description ?? ''}`,
      description,
      label,
    };
    if (description) {
      ret.label = React.createElement('div', {}, [
        React.createElement<TextProps>(Text, { key: 0, title: d.label } as TextProps, d.label),
        React.createElement<TextProps>(
          Text,
          { key: 1, className: 'rc-tree-select-tree-title-desc', color: 'dimmed', title: d.description } as TextProps,
          d.description,
        ),
      ]);
    }
    return ret;
  });
}

export const FilterConfigModel_TreeSelect = types
  .compose(
    'FilterConfigModel_TreeSelect',
    types.model({
      _name: types.literal('tree-select'),
      min_width: types.optional(types.string, ''),
      default_value: types.optional(types.array(types.string), []),
    }),
    FilterConfigModel_BaseSelect,
  )
  .views((self) => ({
    get json() {
      const { _name, default_value, min_width, static_options, options_query_id, default_selection_count } = self;
      return {
        _name,
        min_width,
        default_value,
        static_options,
        options_query_id,
        default_selection_count,
      };
    },
    get treeData() {
      // @ts-expect-error type of getRoot
      const { data } = getRoot(self).content.getDataStuffByID(self.options_query_id);
      const dataWithCustomLabel = addLabelToData(data);
      return queryDataToTree(dataWithCustomLabel);
    },
    get errorMessage() {
      // @ts-expect-error type of getRoot
      const { error } = getRoot(self).content.getDataStuffByID(self.options_query_id);
      return error;
    },
    get treeDataLoading() {
      // @ts-expect-error type of getRoot
      const { state } = getRoot(self).content.getDataStuffByID(self.options_query_id);
      return state === 'loading';
    },
    get defaultSelection() {
      const { default_selection_count } = self;
      if (!default_selection_count) {
        return [];
      }
      const treeData = this.treeData;
      return treeData.slice(0, default_selection_count).map((o) => o.value);
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: string[]) {
      self.default_value = cast(default_value);
    },
    setMinWidth(v: string) {
      self.min_width = v;
    },
    applyDefaultSelection() {
      // @ts-expect-error typeof getParent
      const key = getParent(self, 1).key;
      // @ts-expect-error typeof getRoot
      const filters = getRoot(self).content.filters;
      filters.setValueByKey(key, self.defaultSelection);
    },
    afterCreate() {
      addDisposer(
        self,
        reaction(() => JSON.stringify(self.defaultSelection), this.applyDefaultSelection, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));

export type IFilterConfig_TreeSelect = Instance<typeof FilterConfigModel_TreeSelect>;

export const createFilterConfig_TreeSelect = () =>
  FilterConfigModel_TreeSelect.create({
    _name: 'tree-select',
    default_value: [],
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
