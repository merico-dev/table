import { observer } from 'mobx-react-lite';
import { FilterMetaInstance } from '~/model';
import { FilterTreeSelectConfigInstance } from '~/model';
import { FilterTreeSelectWidget } from './widget';
import { useEffect, useMemo, useState } from 'react';
import { AnyObject } from '~/types';
import { useWhyDidYouUpdate } from 'ahooks';

interface IFilterTreeSelect extends Omit<FilterMetaInstance, 'key' | 'type' | 'config'> {
  config: FilterTreeSelectConfigInstance;
  value: $TSFixMe;
  onChange: (v: string[], forceSubmit?: boolean) => void;
}

export const FilterTreeSelect = observer(({ label, config, value, onChange }: IFilterTreeSelect) => {
  const { treeData, treeDataLoading, errorMessage } = config;

  const [local, setLocal] = useState(config.valueObjects(value));
  const handleChange = (newLocal: AnyObject[]) => {
    setLocal(newLocal);

    const newValue = newLocal.map((o) => o.value);
    onChange(newValue, false);
  };
  useEffect(() => {
    setLocal(config.valueObjects(value));
  }, [value]);

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
