import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useModelContext } from '~/contexts';
import { FilterModelInstance } from '../../../model';
import { IFilterConfig_TreeSelect } from '../../../model/filters/filter/tree-select';
import { FilterTreeSelectWidget } from './widget';

interface IFilterTreeSelect extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_TreeSelect;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

export const FilterTreeSelect = observer(({ label, config, value, onChange }: IFilterTreeSelect) => {
  const model = useModelContext();
  const usingRemoteOptions = !!config.options_query_id;
  const { state } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  useEffect(() => {
    if (!config.select_first_by_default) {
      return;
    }
    const newValue = [config.options[0]?.value] ?? [];

    console.log('Selecting the first option by default. New value: ', newValue);
    onChange(newValue);
  }, [config.select_first_by_default, config.options, onChange]);

  const minWidth = config.min_width ? config.min_width : '200px';
  const disabled = usingRemoteOptions ? loading : false;
  return (
    <FilterTreeSelectWidget
      style={{ minWidth, maxWidth: disabled ? minWidth : 'unset', borderColor: '#e9ecef' }}
      value={value}
      onChange={onChange}
      treeData={config.options}
      label={label}
    />
  );
});
