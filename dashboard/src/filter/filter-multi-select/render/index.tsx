import { observer } from 'mobx-react-lite';
import { useContentModelContext } from '~/contexts';
import { FilterModelInstance } from '../../../model';
import { IFilterConfig_MultiSelect } from '../../../model/filters/filter/multi-select';
import { MultiSelectWidget } from './widget';

interface IFilterMultiSelect extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_MultiSelect;
  value: $TSFixMe;
  onChange: (v: string[], forceSubmit?: boolean) => void;
}

export const FilterMultiSelect = observer(({ label, config, value, onChange }: IFilterMultiSelect) => {
  const model = useContentModelContext();
  const usingRemoteOptions = !!config.options_query_id;
  const { state } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  const width = config.min_width ? config.min_width : '200px';
  const disabled = usingRemoteOptions ? loading : false;
  return (
    <MultiSelectWidget
      label={label}
      options={config.options}
      disabled={disabled}
      value={value}
      onChange={onChange}
      width={width}
    />
  );
});
