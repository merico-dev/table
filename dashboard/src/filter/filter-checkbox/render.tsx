import { Box, Checkbox, Text } from '@mantine/core';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_Checkbox } from '../../model/filter/checkbox';

interface IFilterCheckbox extends Omit<FilterModelInstance, 'type' | 'config'> {
  config: IFilterConfig_Checkbox;
  value: any;
  onChange: (v: any) => void;
}

export function FilterCheckbox({ label, config: { default_value, ...rest }, value, onChange }: IFilterCheckbox) {
  return (
    <Box>
      <Text>&nbsp;</Text>
      <Checkbox label={label} checked={value} onChange={(event) => onChange(event.currentTarget.checked)} {...rest} />
    </Box>
  );
}
