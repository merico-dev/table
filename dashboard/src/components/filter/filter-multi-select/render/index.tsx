import { observer } from 'mobx-react-lite';
import { useRenderContentModelContext } from '~/contexts';
import { FilterMetaInstance, FilterMultiSelectConfigInstance } from '~/model';
import { MultiSelectWidget } from './widget';

interface IFilterMultiSelect extends Omit<FilterMetaInstance, 'key' | 'type' | 'config'> {
  config: FilterMultiSelectConfigInstance;
  value: $TSFixMe;
  onChange: (v: string[], forceSubmit?: boolean) => void;
}

export const FilterMultiSelect = observer(({ label, config, value, onChange }: IFilterMultiSelect) => {
  const model = useRenderContentModelContext();
  const usingRemoteOptions = !!config.options_query_id;
  const { state, error } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  const width = config.min_width ? config.min_width : '200px';
  const disabled = usingRemoteOptions ? loading : false;

  const handleChange = (v: string[]) => onChange(v, false);
  return (
    <MultiSelectWidget
      label={label}
      options={config.options}
      style={{ minWidth: '160px', width, maxWidth: disabled ? width : 'unset', borderColor: '#e9ecef' }}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      errorMessage={error}
      required={config.required}
    />
  );
});
