import { Group, Tooltip, Text, ActionIcon, Menu, Divider } from '@mantine/core';
import React from 'react';
import { InfoCircle, Refresh, Settings, Trash } from 'tabler-icons-react';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { PanelContext } from '../contexts/panel-context';
import { PanelSettingsModal } from './settings';

interface IPanelTitleBar {
}

export function PanelTitleBar({ }: IPanelTitleBar) {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const { title, description, loading, refreshData } = React.useContext(PanelContext)
  const { inEditMode } = React.useContext(LayoutStateContext);
  return (
    <Group position='apart' noWrap sx={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
      <Group>
        {description && (
          <Tooltip label={description} withArrow>
            <InfoCircle size={12} style={{ verticalAlign: 'baseline', cursor: 'pointer' }} />
          </Tooltip>
        )}
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