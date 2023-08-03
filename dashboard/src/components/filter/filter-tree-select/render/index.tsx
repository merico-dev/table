import { observer } from 'mobx-react-lite';
import { FilterMetaInstance } from '~/model';
import { FilterTreeSelectConfigInstance } from '~/model';
import { FilterTreeSelectWidget } from './widget';

interface IFilterTreeSelect extends Omit<FilterMetaInstance, 'key' | 'type' | 'config'> {
  config: FilterTreeSelectConfigInstance;
  value: $TSFixMe;
  onChange: (v: string[], forceSubmit?: boolean) => void;
}

export const FilterTreeSelect = observer(({ label, config, value, onChange }: IFilterTreeSelect) => {
  const { treeData, treeDataLoading, errorMessage } = config;

  const width = config.min_width ? config.min_width : '200px';

  const usingRemoteOptions = !!config.options_query_id;
  const disabled = usingRemoteOptions ? treeDataLoading : false;
  return (
    <FilterTreeSelectWidget
      disabled={disabled}
      style={{ minWidth: '160px', width, maxWidth: disabled ? width : 'unset', borderColor: '#e9ecef' }}
      value={value}
      onChange={(v: string[]) => onChange(v, false)}
      // treeData={config.options}
      treeData={treeData}
      errorMessage={errorMessage}
      label={label}
    />
  );
});
