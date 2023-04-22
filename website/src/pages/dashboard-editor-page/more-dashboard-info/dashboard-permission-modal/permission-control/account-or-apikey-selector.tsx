import { Select } from '@mantine/core';
import { AccountOrAPIKeyOptionType } from '../../../../../api-caller/dashboard-permission.types';

interface IAccountOrAPIKeySelector {
  value: string;
  onChange: (v: string) => void;
  options?: AccountOrAPIKeyOptionType[];
  optionsLoading: boolean;
}

export const AccountOrAPIKeySelector = ({ options, optionsLoading, value, onChange }: IAccountOrAPIKeySelector) => {
  if (!options || optionsLoading) {
    return (
      <Select size="xs" placeholder={optionsLoading ? 'Loading...' : 'Failed to fetch options'} data={[]} disabled />
    );
  }
  return <Select size="xs" placeholder="Select one" data={options} value={value} onChange={onChange} />;
};
