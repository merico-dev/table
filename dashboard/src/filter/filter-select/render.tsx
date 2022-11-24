import { Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_Select } from '../../model/filters/filter/select';
import { useSelectFirstOption } from '../use-select-first-option';

interface IFilterSelect extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_Select;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

export const FilterSelect = observer(({ label, config, value, onChange }: IFilterSelect) => {
  const model = useModelContext();
  const usingRemoteOptions = !!config.options_query_id;
  const { data: remoteOptions, state } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  useSelectFirstOption({ config, value, onChange, options: remoteOptions });

  return (
    <Select
      label={label}
      // @ts-expect-error type of remoteOptions
      data={usingRemoteOptions ? remoteOptions : config.static_options}
      disabled={usingRemoteOptions ? loading : false}
      value={value}
      onChange={onChange}
      styles={{
        input: {
          borderColor: '#e9ecef',
        },
      }}
    />
  );
});
