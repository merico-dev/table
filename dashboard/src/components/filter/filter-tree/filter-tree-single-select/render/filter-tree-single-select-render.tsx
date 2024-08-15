import { observer } from 'mobx-react-lite';
import { TreeItem } from 'performant-array-to-tree';
import { useMemo } from 'react';
import { FilterMetaInstance, FilterTreeSingleSelectConfigInstance } from '~/model';
import { FilterTreeSingleSelectWidget } from './widget';

interface Props extends Omit<FilterMetaInstance, 'key' | 'type' | 'config'> {
  config: FilterTreeSingleSelectConfigInstance;
  value: string;
  onChange: (v: string, forceSubmit?: boolean) => void;
}

export const FilterTreeSingleSelect = observer(({ label, config, value, onChange }: Props) => {
  const { treeData, treeDataLoading, errorMessage } = config;

  const handleChange = (newLocal: TreeItem) => {
    onChange(newLocal.value, false);
  };

  const widgetValue = useMemo(() => {
    return config.initialSelection(value);
  }, [value, config.initialSelection]);

  const width = config.min_width ? config.min_width : '200px';
  const usingRemoteOptions = !!config.options_query_id;
  const disabled = usingRemoteOptions ? treeDataLoading : false;
  return (
    <FilterTreeSingleSelectWidget
      disabled={disabled}
      style={{ minWidth: '160px', width, maxWidth: disabled ? width : 'unset', borderColor: '#e9ecef' }}
      value={widgetValue}
      onChange={handleChange}
      treeData={treeData}
      errorMessage={errorMessage}
      label={label}
      required={config.required}
    />
  );
});
