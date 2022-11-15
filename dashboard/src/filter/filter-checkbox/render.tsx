import { Box, Checkbox, Text } from '@mantine/core';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_Checkbox } from '../../model/filters/filter/checkbox';

interface IFilterCheckbox extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_Checkbox;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FilterCheckbox({ label, config: { default_value, ...rest }, value, onChange }: IFilterCheckbox) {
  return (
    <Box>
      <Text>&nbsp;</Text>
      <Checkbox
        label={label}
        checked={value || false}
        onChange={(event) => onChange(event.currentTarget.checked)}
        {...rest}
        pt=".4em"
        styles={{
          input: {
            borderColor: '#e9ecef',
          },
        }}
      />
    </Box>
  );
}
