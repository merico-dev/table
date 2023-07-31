import { Group, Select, Text } from '@mantine/core';
import { forwardRef } from 'react';
import { AccountOrAPIKeyOptionType } from '../../../../../api-caller/dashboard-permission.types';
import { AccountTypeIcon } from '../../../../../components/account-type-icon';

const SelectItem = forwardRef<HTMLDivElement, AccountOrAPIKeyOptionType>(({ label, type, ...others }, ref) => (
  <Group position="apart" ref={ref} {...others}>
    <Text>{label}</Text>
    <AccountTypeIcon type={type} />
  </Group>
));

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
  if (!options || optionsLoading) {
    return (
      <Select size="xs" placeholder={optionsLoading ? 'Loading...' : 'Failed to fetch options'} data={[]} disabled />
    );
  }
  return (
    <Select
      size="xs"
      placeholder="Select one"
      itemComponent={SelectItem}
      rightSection={type ? <AccountTypeIcon type={type} /> : undefined}
      rightSectionWidth={58}
      maxDropdownHeight={280}
      styles={{ rightSection: { pointerEvents: 'none' } }}
      data={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      withinPortal
      zIndex={340}
    />
  );
};
