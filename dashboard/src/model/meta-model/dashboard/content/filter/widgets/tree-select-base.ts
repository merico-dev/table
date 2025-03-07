import { Text, TextProps } from '@mantine/core';
import { Instance, types } from 'mobx-state-tree';
import React from 'react';
import { queryDataToTree, ITreeDataQueryOption, ITreeDataRenderItem } from '~/components/filter/filter-tree';
import { FilterBaseSelectConfigMeta } from './select-base';
import { DefaultValueModeModelType } from '../types';

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

export const FilterBaseTreeSelectConfigMeta = types
  .compose(
    'FilterConfigModel_BaseTreeSelect',
    types.model({
      min_width: types.optional(types.string, ''),
      default_value_mode: DefaultValueModeModelType,
    }),
    FilterBaseSelectConfigMeta,
  )
  .views((self) => ({
    get plainData() {
      const { data } = self.contentModel.getDataStuffByID(self.options_query_id);
      return data;
    },
    get treeData() {
      const data = this.plainData;
      const dataWithCustomLabel = addLabelToData(data);
      return queryDataToTree(dataWithCustomLabel);
    },
    get errorMessage() {
      const { error } = self.contentModel.getDataStuffByID(self.options_query_id);
      return error;
    },
    get treeDataLoading() {
      const { state } = self.contentModel.getDataStuffByID(self.options_query_id);
      return state === 'loading';
    },
  }))
  .actions((self) => ({
    setMinWidth(v: string) {
      self.min_width = v;
    },
  }));

export type FilterBaseTreeSelectConfigMetaInstance = Instance<typeof FilterBaseTreeSelectConfigMeta>;
