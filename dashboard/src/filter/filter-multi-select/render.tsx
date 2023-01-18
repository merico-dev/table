import { MultiSelect } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useModelContext } from '~/contexts';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_MultiSelect } from '../../model/filters/filter/multi-select';
import { FilterSelectItem } from '../select-item';

interface IFilterMultiSelect extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_MultiSelect;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

export const FilterMultiSelect = observer(({ label, config, value, onChange }: IFilterMultiSelect) => {
  const model = useModelContext();
  const usingRemoteOptions = !!config.options_query_id;
  const { state } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  useEffect(() => {
    const { default_selection_count } = config;
    if (!default_selection_count) {
      return;
    }
    const newValue = config.options.slice(0, default_selection_count).map((o: any) => o.value);

    console.log(`Selecting first ${default_selection_count} option(s) by default. New value: `, newValue);
    onChange(newValue);
  }, [config.default_selection_count, config.options]);

  const minWidth = config.min_width ? config.min_width : '200px';
  const disabled = usingRemoteOptions ? loading : false;
  return (
    <MultiSelect
      label={label}
      data={config.options}
      disabled={disabled}
      value={value}
      onChange={onChange}
      styles={{
        root: {
          minWidth,
          maxWidth: disabled ? minWidth : 'unset',
        },
        input: {
          borderColor: '#e9ecef',
        },
      }}
      itemComponent={FilterSelectItem}
    />
  );
});
