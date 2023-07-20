import { TextInput } from '@mantine/core';
import { FilterModelInstance } from '~/dashboard-editor/model';
import { IFilterConfig_TextInput } from '~/dashboard-editor/model/filters/filter/text-input';

interface IFilterTextInput extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_TextInput;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

export function FilterTextInput({ label, config, value, onChange }: IFilterTextInput) {
  return (
    <TextInput
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.currentTarget.value)}
      {...config}
      styles={{
        input: {
          borderColor: '#e9ecef',
        },
      }}
    />
  );
}
