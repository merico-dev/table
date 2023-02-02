import { Text } from '@mantine/core';
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
      filterBasis: `${label}___${description ?? ''}`,
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
  onChange: (v: string[], forceSubmit?: boolean) => void;
}

export const FilterTreeSelect = observer(({ label, config, value, onChange }: IFilterTreeSelect) => {
  const model = useModelContext();
  const { state, dataProxy, len } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  const treeData = useMemo(() => {
    if (!dataProxy) {
      return [];
    }
    const data: any[] = [...dataProxy];
    const dataWithCustomLabel = addLabelToData(data);
    return queryDataToTree(dataWithCustomLabel);
  }, [dataProxy, len]);

  useEffect(() => {
    const { default_selection_count } = config;
    if (!default_selection_count) {
      return;
    }
    if (treeData.length === 0) {
      console.log('[filter.tree-select] Resetting to empty');
      onChange([], true);
      return;
    }
    const newValue = treeData.slice(0, default_selection_count).map((o) => o.value);

    console.log(`[filter.tree-select] Selecting first ${default_selection_count} option(s)`);
    onChange(newValue, true);
  }, [config.default_selection_count, treeData]);

  const minWidth = config.min_width ? config.min_width : '200px';

  const usingRemoteOptions = !!config.options_query_id;
  const disabled = usingRemoteOptions ? loading : false;
  return (
    <FilterTreeSelectWidget
      disabled={disabled}
      style={{ minWidth, maxWidth: disabled ? minWidth : 'unset', borderColor: '#e9ecef' }}
      value={value}
      onChange={(v: string[]) => onChange(v, false)}
      // treeData={config.options}
      treeData={treeData}
      label={label}
    />
  );
});
