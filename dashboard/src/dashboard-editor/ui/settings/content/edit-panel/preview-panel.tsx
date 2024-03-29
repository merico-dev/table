import { Box, Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DescriptionPopover } from '~/components/panel';
import { PanelVizSection } from '~/components/panel/panel-render/viz/panel-viz-section';
import { useRenderPanelContext } from '~/contexts';
import { ErrorBoundary } from '~/utils';

export const PreviewPanel = observer(() => {
  const { panel } = useRenderPanelContext();
  return (
    <ErrorBoundary>
      <Box sx={{ height: '100%', flexGrow: 0, flexShrink: 0, width: '600px' }}>
        <Stack
          mt={24}
          spacing={5}
          sx={{
            width: '600px',
            height: '450px',
            background: 'transparent',
            borderRadius: '5px',
            border: '1px solid #e9ecef',
            borderWidth: panel.style.border.enabled ? '1px' : '0px',
          }}
        >
          <Group position="apart" noWrap sx={{ flexGrow: 0, flexShrink: 0 }}>
            <Group>
              <DescriptionPopover />
            </Group>
            <Group grow position="center">
              <Text lineClamp={1} weight="bold">
                {panel.title.show ? panel.name : ''}
              </Text>
            </Group>
            <Group position="right" spacing={0} sx={{ height: '28px' }} />
          </Group>
          <Group px={5} pb={5} sx={{ flexGrow: 1, '.panel-viz-section': { height: 'calc(100% - 28px)' } }}>
            <PanelVizSection panel={panel} />
          </Group>
        </Stack>
      </Box>
    </ErrorBoundary>
  );
});
