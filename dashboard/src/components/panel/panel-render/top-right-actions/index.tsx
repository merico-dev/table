import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { usePanelVizFeatures } from '../panel-viz-features';

interface Props {
  dropdownContent?: ReactNode;
  showDropdownMenu: boolean;
  chartControlsSlotId: string;
  panelAddonSlotId: string | null;
}

export const PanelTopRightActions = observer(
  ({ dropdownContent, showDropdownMenu, chartControlsSlotId, panelAddonSlotId }: Props) => {
    const { withAddon, withPanelTitle } = usePanelVizFeatures();

    const showDropdown = withPanelTitle && showDropdownMenu;

    return (
      <Group
        className="panel-top-right-actions"
        gap="xs"
        wrap="nowrap"
        justify="flex-end"
        pos="absolute"
        sx={{
          zIndex: 410,
        }}
      >
        {/* Chart-based controls portal target */}
        <div id={chartControlsSlotId}></div>

        {/* Panel addons portal target */}
        {withAddon && panelAddonSlotId && <div id={panelAddonSlotId}></div>}

        {/* Panel dropdown menu */}
        {showDropdown && dropdownContent}
      </Group>
    );
  },
);

export { PanelTopRightActionsPortal } from './portal';
