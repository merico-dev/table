import { Box, Checkbox, Text } from '@mantine/core';
import { IDashboardFilter, IFilterConfig_Checkbox } from '../../types';

interface IFilterCheckbox extends Omit<IDashboardFilter, 'type' | 'config'> {
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
