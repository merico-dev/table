import { Menu } from '@mantine/core';
import { IconHistory } from '@tabler/icons';
import { TModalState } from '../types';

interface IProps {
  state: TModalState;
}
export const DashboardChangelogModalTrigger = ({ state }: IProps) => {
  return (
    <Menu.Item onClick={state.open} icon={<IconHistory size={14} />}>
      Changelog
    </Menu.Item>
  );
};
