import { Group, Select, SelectProps, Text } from '@mantine/core';
import { useCallback } from 'react';
import { AccountOrAPIKeyOptionType } from '../../../../../api-caller/dashboard-permission.types';
import { AccountTypeIcon } from '../../../../../components/account-type-icon';

const SelectItem: SelectProps['renderOption'] = ({ option, ...others }) => {
  const { label, type } = option as AccountOrAPIKeyOptionType;
  return (
    <Group justify="space-between" {...others}>
      <Text>{label}</Text>
      <AccountTypeIcon type={type} />
    </Group>
  );
};
interface IAccountOrAPIKeySelector {
  value: string;
  onChange: (v: string) => void;
  options?: AccountOrAPIKeyOptionType[];
  optionsLoading: boolean;
  disabled: boolean;
  type: 'ACCOUNT' | 'APIKEY';
}

export const AccountOrAPIKeySelector = ({
  options,
  optionsLoading,
  value,
  onChange,
  disabled,
  type,
}: IAccountOrAPIKeySelector) => {
  const handleChange = useCallback(
    (v: string | null) => {
      v !== null && onChange(v);
    },
    [onChange],
  );
  if (!options || optionsLoading) {
    return (
      <Select size="xs" placeholder={optionsLoading ? 'Loading...' : 'Failed to fetch options'} data={[]} disabled />
    );
  }
  return (
    <Select
      size="xs"
      placeholder="Select one"
      renderOption={SelectItem}
      rightSection={type ? <AccountTypeIcon type={type} /> : undefined}
      rightSectionWidth={58}
      maxDropdownHeight={280}
      styles={{ section: { pointerEvents: 'none' } }}
      data={options}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      comboboxProps={{
        withinPortal: true,
        zIndex: 340,
      }}
    />
  );
};
