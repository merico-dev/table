import { Stack, Text } from '@mantine/core';
import { useWhyDidYouUpdate } from 'ahooks';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useModelContext } from '~/contexts';
import { FilterModelInstance } from '../../../model';
import { IFilterConfig_TreeSelect } from '../../../model/filters/filter/tree-select';
import { ITreeDataQueryOption, ITreeDataRenderItem } from '../types';
import { queryDataToTree } from './query-data-to-tree';
import { FilterTreeSelectWidget } from './widget';

function addLabelToData(data: ITreeDataQueryOption[]) {
  return data.map((d) => {
    const { label, description, ...rest } = d;
    const ret: ITreeDataRenderItem = {
      ...rest,
      description,
      label,
    };
    if (description) {
      ret.label = (
        <div>
          <Text title={d.label}>{d.label}</Text>
          <Text className="rc-tree-select-tree-title-desc" color="dimmed" title={d.description}>
            {d.description}
          </Text>
        </div>
      );
    }
    return ret;
  });
}

interface IFilterTreeSelect extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_TreeSelect;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

export const FilterTreeSelect = observer(({ label, config, value, onChange }: IFilterTreeSelect) => {
  const model = useModelContext();
  const { state } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  const data = config.data;

  const treeData = useMemo(() => {
    if (!data) {
      return [];
    }

    const dataWithCustomLabel = addLabelToData(data);
    return queryDataToTree(dataWithCustomLabel);
  }, [data]);

  useEffect(() => {
    const { default_selection_count } = config;
    if (!default_selection_count) {
      return;
    }
    const newValue = cloneDeep(treeData)
      .slice(0, default_selection_count)
      .map((o) => o.value);

    console.log(`Selecting first ${default_selection_count} option(s) by default. New value: `, newValue);
    onChange(newValue);
  }, [config.default_selection_count, treeData]);

  const minWidth = config.min_width ? config.min_width : '200px';

  const usingRemoteOptions = !!config.options_query_id;
  const disabled = usingRemoteOptions ? loading : false;
  return (
    <FilterTreeSelectWidget
      style={{ minWidth, maxWidth: disabled ? minWidth : 'unset', borderColor: '#e9ecef' }}
      value={value}
      onChange={onChange}
      // treeData={config.options}
      treeData={treeData}
      label={label}
    />
  );
});
