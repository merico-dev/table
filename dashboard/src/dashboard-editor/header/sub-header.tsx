import { Box, Button, Group, Sx } from '@mantine/core';
import { IconPlaylistAdd } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useContentModelContext } from '~/contexts';

const SubHeaderSx: Sx = {
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
  const model = useContentModelContext();
  return (
    <Box sx={SubHeaderSx} pl={{ base: 200, xs: 200, sm: 200, md: 220, lg: 240, xl: 260 }}>
      <Group position="apart" align="center" sx={{ height: '30px' }} pr={16}>
        <Button
          variant="outline"
          color="blue"
          radius={0}
          size="xs"
          disabled={!model.views.VIE}
          onClick={() => model.addANewPanel(model.views.idOfVIE)}
          leftIcon={<IconPlaylistAdd size={20} />}
          sx={{
            height: '30px',
            borderLeft: 'none',
            borderTop: 'none',
            borderRight: '1px solid #e9ecef',
            borderBottom: '1px solid #e9ecef',
            background: 'rgb(231, 245, 255)',
          }}
        >
          Add a Panel
        </Button>
        <Box />
        <Box />
      </Group>
    </Box>
  );
});
