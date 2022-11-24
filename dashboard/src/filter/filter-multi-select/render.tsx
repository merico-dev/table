import { MultiSelect } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_MultiSelect } from '../../model/filters/filter/multi-select';

interface IFilterMultiSelect extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_MultiSelect;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

export const FilterMultiSelect = observer(({ label, config, value, onChange }: IFilterMultiSelect) => {
  const model = useModelContext();
  const usingRemoteOptions = !!config.options_query_id;
  const { data: remoteOptions, state } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  return (
    <MultiSelect
      label={label}
      // @ts-expect-error type of remoteOptions
      data={usingRemoteOptions ? remoteOptions : config.static_options}
      disabled={usingRemoteOptions ? loading : false}
      value={value}
      onChange={onChange}
      sx={{ minWidth: '14em' }}
      styles={{
        input: {
          borderColor: '#e9ecef',
        },
      }}
    />
  );
});
