import { Badge, Box, Button, Group, Modal, Text, Tooltip } from '@mantine/core';
import { IconVersions } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useContentModelContext, useModelContext } from '~/contexts';

const modalStyles = {
  modal: { paddingLeft: '0px !important', paddingRight: '0px !important' },
  header: { marginBottom: 0, padding: '0 20px 10px', borderBottom: '1px solid #efefef' },
  title: { flexGrow: 1 },
  body: {
    padding: '0 0 0 20px',
  },
};

export const ContentVersionManager = observer(() => {
  const contentModel = useContentModelContext();
  const dashboardModel = useModelContext();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        closeOnEscape={false}
        title={
          <Group position="apart" sx={{ flexGrow: 1 }}>
            <Text fw={500}>Version Manager</Text>
            <Group spacing={7}>
              <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                Dashboard: {dashboardModel.name}
              </Badge>
            </Group>
          </Group>
        }
        zIndex={320}
        size="96vw"
        overflow="inside"
        styles={modalStyles}
      >
        <Box sx={{ height: 'calc(100vh - 220px)' }}>TODO</Box>
      </Modal>

      <Tooltip label={`Current version is ${contentModel.name}`} withinPortal>
        <Button
          size="xs"
          variant="light"
          onClick={() => setOpened(true)}
          leftIcon={<IconVersions size={18} />}
          px={16}
          styles={{ inner: { justifyContent: 'flex-start' } }}
        >
          {contentModel.name}
        </Button>
      </Tooltip>
    </>
  );
});
