import { Group, Tooltip, Text, ActionIcon } from '@mantine/core';
import React from 'react';
import { InfoCircle, Refresh } from 'tabler-icons-react';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { PanelContext } from '../contexts/panel-context';
import { PanelSettings } from './settings';

function PanelTitle({ title, description }: { title: string; description: string }) {
  return (
    <Group position="center" sx={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
      {!description && <Text weight="bold" sx={{ marginLeft: '5px', display: 'inline' }}>{title}</Text>}
      {description && (
        <div>
          <Tooltip
            label={description}
            withArrow
          >
            <InfoCircle size={12} style={{ verticalAlign: 'baseline', cursor: 'pointer' }} />
            <Text weight="bold" sx={{ marginLeft: '5px', display: 'inline' }}>{title}</Text>
          </Tooltip>
        </div>
      )}
    </Group>
  )
}

interface IPanelTitleBar {
}

export function PanelTitleBar({ }: IPanelTitleBar) {
  const { title, description, loading, refreshData } = React.useContext(PanelContext)
  const { inEditMode } = React.useContext(LayoutStateContext);
  return (
    <>
      <PanelTitle title={title} description={description} />
      <Group
        position="right"
        spacing={0}
        sx={{
          position: 'absolute',
          right: '15px',
          top: '4px',
          height: '28px',
        }}
      >
        <ActionIcon variant="hover" color="blue" loading={loading} onClick={refreshData}>
          <Refresh size={16} />
        </ActionIcon>
        {inEditMode && <PanelSettings />}
      </Group>
    </>
  )
}