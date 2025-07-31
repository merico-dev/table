import { ActionIcon, Menu } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';

export const PanelDropdownMenu = observer(({ children }: { children: ReactNode }) => {
  return (
    <>
      <Menu withinPortal trigger="hover">
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            color="black"
            size="md"
            pos="absolute"
            top={16}
            right={16}
            style={{ zIndex: 410 }}
          >
            <IconDotsVertical size={14} style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>{children}</Menu.Dropdown>
      </Menu>
    </>
  );
});
