import { TextInput } from '@mantine/core';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_TextInput } from '../../model/filter/text-input';

interface IFilterTextInput extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_TextInput;
  value: any;
  onChange: (v: any) => void;
}

export function FilterTextInput({ label, config, value, onChange }: IFilterTextInput) {
  return <TextInput label={label} value={value} onChange={onChange} {...config} />;
}
