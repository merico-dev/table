import { Box, Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DescriptionPopover } from '~/components/panel';
import '~/components/panel/panel-render/panel-render-base.css';
import { PanelVizSection } from '~/components/panel/panel-render/viz/panel-viz-section';
import { useRenderPanelContext } from '~/contexts';
import { ErrorBoundary } from '~/utils';
import { PanelAddonProvider } from '~/components/plugins/panel-addon';

const PreviewTitleBar = observer(() => {
  const { panel } = useRenderPanelContext();

  if (!panel.title.show) {
    return null;
  }

  return (
    <Group grow justify="center" className="panel-title-wrapper" sx={{ flexGrow: 1 }}>
      <Text size="sm" ta="center" lineClamp={1} className="panel-title-text">
        {panel.title.show ? panel.name : ''}
      </Text>
    </Group>
  );
});

export const PreviewPanel = observer(() => {
  const { panel } = useRenderPanelContext();
  return (
    <ErrorBoundary>
      <Box
        className={`panel-root ${panel.title.show ? 'panel-root--show-title' : ''}`}
        p={0}
        sx={{
          border: '1px solid',
          borderColor: panel.style.border.enabled ? '#e9ecef' : 'transparent',
          flexGrow: 0,
          flexShrink: 0,
          width: '600px !important',
          height: '450px !important',
        }}
      >
        <PanelAddonProvider>
          <Box className="panel-description-popover-wrapper">
            <DescriptionPopover />
          </Box>
          <PreviewTitleBar />
          <PanelVizSection panel={panel} />
        </PanelAddonProvider>
      </Box>
    </ErrorBoundary>
  );
});
