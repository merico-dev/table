import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import { IconPlaylistAdd, IconSettings, IconVersions } from '@tabler/icons';
import { useBoolean, useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { EditVersionInfoModal } from './edit-version-info-modal';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { APICaller } from '../../../../api-caller';

export const ContentVersionManager = observer(() => {
  const { store } = useDashboardStore();
  const content = store.currentDetail?.content.fullData;
  const dashboardID = store.currentID;
  const currentContentID = store.currentDetail?.content_id;

  const [opened, { setTrue, setFalse }] = useBoolean(false);

  const { data = [], loading } = useRequest(
    async () => {
      const ret = await APICaller.dashboard_content.list({
        dashboard_id: dashboardID,
        filter: {
          name: { value: '', isFuzzy: true },
        },
        pagination: {
          page: 1,
          pagesize: 1000,
        },
      });
      return ret.data;
    },
    {
      refreshDeps: [dashboardID],
    },
  );

  if (!content) {
    return null;
  }

  const dashboardName = store.currentDetail?.name;

  if (!dashboardName) {
    return null;
  }

  const switchContent = (id: string) => {
    if (id === currentContentID) {
      return;
    }

    console.log('TODO:  switchContent ', id);
  };
  return (
    <>
      <EditVersionInfoModal opened={opened} close={setFalse} content={content} dashboardName={dashboardName} />

      <Group spacing={1}>
        <Menu
          shadow="md"
          width={200}
          trigger="hover"
          openDelay={100}
          closeDelay={400}
          withinPortal
          zIndex={320}
          disabled={loading}
        >
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
            {data.map((d) => {
              const isCurrent = currentContentID === d.id;
              return (
                <Menu.Item
                  key={d.id}
                  color={isCurrent ? 'blue' : undefined}
                  sx={{ cursor: isCurrent ? 'default' : 'pointer' }}
                  onClick={() => switchContent(d.id)}
                >
                  {d.name}
                </Menu.Item>
              );
            })}
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
