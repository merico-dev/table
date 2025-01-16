import { IPanelAddonRenderProps, pluginManager } from '@devtable/dashboard';
import { ActionIcon } from '@mantine/core';
import { IconBug } from '@tabler/icons-react';
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
  if (!renderOptions || isInEditMode) {
    return null;
  }
  return (
    <div style={{ position: 'absolute', top: 2, right: 32, zIndex: 400 }}>
      <ActionIcon
        onClick={(ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          console.log('ask ai', renderOptions);
        }}
        size="sm"
        variant="transparent"
      >
        <IconBug />
      </ActionIcon>
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
