import { ActionIcon } from '@mantine/core';
import { TModalState } from '../types';
import { IconHistory } from '@tabler/icons';

interface IProps {
  state: TModalState;
}
export const DashboardChangelogModalTrigger = ({ state }: IProps) => {
  return (
    <ActionIcon onClick={state.open} color="blue" variant="light">
      <IconHistory size={16} />
    </ActionIcon>
  );
};
