import { Box, Group } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import { AddAPanel } from './add-a-panel';
import { BreakpointSwitcher } from './breakpoint-switcher';
import { DownloadThisView } from './download-this-view';
import { ImportWithSchema } from './import-with-schema';
import { SpotlightControl } from './spotlight';

const SubHeaderSx: EmotionSx = {
  position: 'fixed',
  top: 60, // height of mantine-header
  left: 0,
  right: 0,
  height: 30,
  zIndex: 299,
  borderBottom: '1px solid #e9ecef',
  background: 'rgba(233,236,239, 0.15)',
};

export const SubHeader = observer(() => {
  return (
    <Box sx={SubHeaderSx} pl={{ base: 200, xs: 200, sm: 200, md: 220, lg: 240, xl: 260 }}>
      <Group position="apart" align="center" sx={{ height: '30px' }}>
        <Group position="left" spacing={0}>
          <AddAPanel />
          <ImportWithSchema />
          <SpotlightControl />
        </Group>
        <BreakpointSwitcher />
        <Group position="right" spacing={0}>
          <DownloadThisView />
        </Group>
      </Group>
    </Box>
  );
});
