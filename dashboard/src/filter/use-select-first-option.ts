import { useEffect } from 'react';
import { IFilterConfig_MultiSelect } from '~/model/filters/filter/multi-select';
import { IFilterConfig_Select } from '~/model/filters/filter/select';

interface IUseSelectFirstOption {
  config: IFilterConfig_Select | IFilterConfig_MultiSelect;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
  options: $TSFixMe[];
}
export function useSelectFirstOption({ config, value, onChange, options }: IUseSelectFirstOption) {
  useEffect(() => {
    if (!config.select_first_by_default) {
      return;
    }
    const newValue = options[0]?.value ?? '';
    if (value === newValue) {
      return;
    }

    console.log('Selecting the first option by default. Previous value: ', value, ', new value: ', newValue);
    onChange(newValue);
  }, [config.select_first_by_default, options, onChange, value]);
}
