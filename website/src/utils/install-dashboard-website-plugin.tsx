import { IPanelAddonRenderProps, pluginManager, useVisibleFilters } from '@devtable/dashboard';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';
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
    <Tooltip label="Print ECharts option to console">
      <ActionIcon
        onClick={(ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          console.log('debug', renderOptions, 'filters', formattedFilters);
        }}
        variant="subtle"
        color="black"
        size="md"
      >
        <IconCode size={14} style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
    </Tooltip>
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
