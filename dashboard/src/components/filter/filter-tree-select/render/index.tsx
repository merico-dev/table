import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { FilterMetaInstance, FilterTreeSelectConfigInstance } from '~/model';
import { AnyObject } from '~/types';
import { FilterTreeSelectWidget } from './widget';

interface IFilterTreeSelect extends Omit<FilterMetaInstance, 'key' | 'type' | 'config'> {
  config: FilterTreeSelectConfigInstance;
  value: $TSFixMe;
  onChange: (v: string[], forceSubmit?: boolean) => void;
}

export const FilterTreeSelect = observer(({ label, config, value, onChange }: IFilterTreeSelect) => {
  const { treeData, treeDataLoading, errorMessage } = config;

  const [local, setLocal] = useState(config.defaultSelectionOptions);
  const handleChange = (newLocal: AnyObject[]) => {
    setLocal(newLocal);

    const newValue = newLocal.map((o) => o.value);
    onChange(newValue, false);
  };
  useEffect(() => {
    setLocal(config.defaultSelectionOptions);
  }, [config.defaultSelectionOptions]);

  const width = config.min_width ? config.min_width : '200px';
  const usingRemoteOptions = !!config.options_query_id;
  const disabled = usingRemoteOptions ? treeDataLoading : false;
  return (
    <FilterTreeSelectWidget
      disabled={disabled}
      style={{ minWidth: '160px', width, maxWidth: disabled ? width : 'unset', borderColor: '#e9ecef' }}
      value={local}
      onChange={handleChange}
      treeData={treeData}
      errorMessage={errorMessage}
      label={label}
      required={config.required}
      treeCheckStrictly={config.treeCheckStrictly}
    />
  );
});
