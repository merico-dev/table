import { IPanelAddonRenderProps, pluginManager, useVisibleFilters } from '@devtable/dashboard';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconBug, IconCode } from '@tabler/icons-react';
import React from 'react';

export const PrintEChartsOptionAddon = ({ viz, isInEditMode }: IPanelAddonRenderProps) => {
  const [renderOptions, setRenderOptions] = React.useState<unknown | null>(null);
  React.useEffect(() => {
    const listener = (opt: unknown) => {
      setRenderOptions(opt);
    };
    const channel = viz.messageChannels.getChannel('viz');
    channel.on('rendered', listener);
    return () => {
      channel.off('rendered', listener);
    };
  }, [viz.messageChannels]);
  const formattedFilters = useVisibleFilters();
  if (!renderOptions || isInEditMode) {
    return null;
  }
  return (
    <div style={{ position: 'absolute', bottom: 2, right: 2, zIndex: 400 }}>
      <Tooltip label="Print ECharts option to console">
        <ActionIcon
          onClick={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            console.log('debug', renderOptions, 'filters', formattedFilters);
          }}
          size="sm"
          variant="white"
          color="gray"
        >
          <IconCode />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};
pluginManager.install({
  id: 'website',
  manifest: {
    viz: [],
    color: [],
    panelAddon: [
      {
        name: 'log-options',
        addonRender: PrintEChartsOptionAddon,
      },
    ],
  },
  version: '0.1',
});
