import { ActionIcon, Menu } from '@mantine/core';
import { Menu2 } from 'tabler-icons-react';
import { useAccountContext } from '../../../require-auth/account-context';
import { DeleteDashboard } from './delete-dashboard';

interface IActionMenu {
  id: string;
  preset: boolean;
}
export const ActionMenu = ({ id, preset }: IActionMenu) => {
  const { canEdit } = useAccountContext();

  if (!canEdit || preset) {
    return null;
  }
  return (
    <Menu shadow="md" width={220} withinPortal trigger="hover">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="blue"
          sx={{
            width: '42px',
            height: '42px',
          }}
        >
          <Menu2 size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <DeleteDashboard id={id} />
        <Menu.Item>Overwrite with JSON file</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
