import { ActionIcon, Menu, Text } from '@mantine/core';
import { Menu2 } from 'tabler-icons-react';

interface IActionMenu {
  id: string;
}
export const ActionMenu = ({ id }: IActionMenu) => {
  return (
    <Menu shadow="md" width={200} withinPortal trigger="hover">
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
        <Menu.Item>Delete this dashboard</Menu.Item>
        <Menu.Item>Overwrite with JSON file</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
