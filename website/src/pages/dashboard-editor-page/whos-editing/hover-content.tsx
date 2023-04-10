import { PresenceType } from './types';
import { Text } from '@mantine/core';

interface IProps {
  accounts: string[];
  clients: number;
  presence: PresenceType;
}
export const HoverContent = ({ clients, accounts }: IProps) => {
  if (clients === 0) {
    return <Text>Something went wrong</Text>;
  }
  if (clients === 1) {
    return <Text>Only you are editing</Text>;
  }
  if (accounts.length === 1) {
    return <Text>You're editing this dashboard with {clients} browser tabs</Text>;
  }
  return <Text>{accounts.length} accounts are editing</Text>;
};
