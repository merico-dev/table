import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import { IconPlaylistAdd, IconSettings, IconVersions } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { EditVersionInfoModal } from './edit-version-info-modal';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';

export const ContentVersionManager = observer(() => {
  const { store } = useDashboardStore();
  const content = store.currentDetail?.content.fullData;

  const [opened, { setTrue, setFalse }] = useBoolean(false);

  if (!content) {
    return null;
  }

  const dashboardName = store.currentDetail?.name;

  if (!dashboardName) {
    return null;
  }

  return (
    <>
      <EditVersionInfoModal opened={opened} close={setFalse} content={content} dashboardName={dashboardName} />

      <Group spacing={1}>
        <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={400} withinPortal zIndex={320}>
          <Menu.Target>
            <Button
              size="xs"
              variant="light"
              leftIcon={<IconVersions size={18} />}
              sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              {content.name}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Switch version</Menu.Label>
            <Menu.Divider />
            <Menu.Item color="blue" icon={<IconPlaylistAdd size={18} />}>
              Add a version
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <ActionIcon
          variant="light"
          color="blue"
          onClick={setTrue}
          sx={{
            height: '30px',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <IconSettings size={18} />
        </ActionIcon>
      </Group>
    </>
  );
});
