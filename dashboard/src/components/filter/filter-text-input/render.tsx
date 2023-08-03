import { TextInput } from '@mantine/core';
import { FilterMetaInstance } from '~/model';
import { FilterTextInputConfigInstance } from '~/model';

interface IFilterTextInput extends Omit<FilterMetaInstance, 'key' | 'type' | 'config'> {
  config: FilterTextInputConfigInstance;
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
