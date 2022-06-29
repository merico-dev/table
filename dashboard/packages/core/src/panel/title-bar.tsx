import { Group, Text, Menu, Divider } from '@mantine/core';
import React from 'react';
import { Refresh, Settings, Trash } from 'tabler-icons-react';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { PanelContext } from '../contexts/panel-context';
import { DescriptionPopover } from './panel-description';
import { PanelSettingsModal } from './settings';

interface IPanelTitleBar {
}

export function PanelTitleBar({ }: IPanelTitleBar) {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const { title, refreshData } = React.useContext(PanelContext)
  const { inEditMode } = React.useContext(LayoutStateContext);
  return (
    <Group position='apart' noWrap>
      <Group>
        <DescriptionPopover />
      </Group>
      <Group grow position="center">
        <Text lineClamp={1} weight="bold">{title}</Text>
      </Group>
      <Group
        position="right"
        spacing={0}
        sx={{ height: '28px' }}
      >
        <Menu>
          <Menu.Item onClick={refreshData} icon={<Refresh size={14} />}>Refresh</Menu.Item>
          {inEditMode && <Menu.Item onClick={open} icon={<Settings size={14} />}>Settings</Menu.Item>}
          <Divider />
          <Menu.Item color="red" disabled icon={<Trash size={14} />}>Delete</Menu.Item>
        </Menu>
      </Group>
      {inEditMode && <PanelSettingsModal opened={opened} close={close} />}
    </Group>
  )
}