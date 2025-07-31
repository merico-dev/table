import { ActionIcon, Menu } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';

import { useRenderPanelContext } from '~/contexts/panel-context';
import { ViewMetaInstance } from '~/model';
import { doesVizRequiresData } from '../../utils';
import { PanelDropdownMenuItems } from './items';

export const PanelDropdownMenu = observer(({ view }: { view: ViewMetaInstance }) => {
  const { panel } = useRenderPanelContext();

  const panelNeedData = doesVizRequiresData(panel.viz.type);
  if (!panelNeedData) {
    return null;
  }

  return (
    <Menu withinPortal trigger="hover">
      <Menu.Target>
        <ActionIcon variant="subtle" color="black" size="md" pos="absolute" top={16} right={16}>
          <IconDotsVertical size={14} style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <PanelDropdownMenuItems view={view} />
      </Menu.Dropdown>
    </Menu>
  );
});
