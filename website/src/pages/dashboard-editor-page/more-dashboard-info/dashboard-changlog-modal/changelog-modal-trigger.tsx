import { Menu, Tooltip } from '@mantine/core';
import { IconHistory } from '@tabler/icons';
import { TModalState } from '../types';

interface IProps {
  state: TModalState;
}
export const DashboardChangelogModalTrigger = ({ state }: IProps) => {
  return (
    <Tooltip label="Temporarily disabled">
      <Menu.Item
        //  onClick={state.open}
        icon={<IconHistory size={14} />}
        color="gray"
      >
        Changelog
      </Menu.Item>
    </Tooltip>
  );
};
