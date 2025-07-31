import { ActionIcon, Menu } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ViewMetaInstance } from '~/model';
import { PanelDropdownMenuItems } from './items';

export const PanelDropdownMenu = observer(({ view, title }: { view: ViewMetaInstance; title: string }) => {
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
        <Menu.Dropdown>
          <PanelDropdownMenuItems view={view} />
        </Menu.Dropdown>
      </Menu>
    </>
  );
});
