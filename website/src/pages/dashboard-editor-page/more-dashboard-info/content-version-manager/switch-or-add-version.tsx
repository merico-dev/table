import { DashboardContentDBType, initialDashboardContent } from '@devtable/dashboard';
import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import { IconPlaylistAdd, IconSettings, IconVersions } from '@tabler/icons';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { APICaller } from '../../../../api-caller';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { useNavigate } from 'react-router-dom';

interface ISwitchOrAddVersion {
  openEdit: () => void;
  content: DashboardContentDBType;
  reloadOptionsTrigger: number;
}

export const SwitchOrAddVersion = observer(({ openEdit, content, reloadOptionsTrigger }: ISwitchOrAddVersion) => {
  const navigate = useNavigate();
  const { store } = useDashboardStore();
  const dashboardID = store.currentID;
  const currentContentID = store.currentDetail?.content.id;

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
      refreshDeps: [dashboardID, reloadOptionsTrigger],
    },
  );

  const { run: addVersion, ...addVersionState } = useRequest(
    async () => {
      const c = await APICaller.dashboard_content.create({
        dashboard_id: dashboardID,
        name: new Date().getTime().toString(),
        content: content?.content ? content.content : initialDashboardContent,
      });
      if (c) {
        store.currentDetail?.content.setID(c.id);
        navigate(`/dashboard/${dashboardID}/edit/${c.id}`);
      }
    },
    {
      manual: true,
    },
  );

  const switchContent = (id: string) => {
    if (id === currentContentID) {
      return;
    }

    store.currentDetail?.content.setID(id);
    navigate(`/dashboard/${dashboardID}/edit/${id}`);
  };

  return (
    <Group spacing={0}>
      <Menu
        shadow="md"
        width={200}
        trigger="hover"
        openDelay={100}
        closeDelay={400}
        withinPortal
        zIndex={320}
        disabled={loading || addVersionState.loading}
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
          <Menu.Item color="blue" icon={<IconPlaylistAdd size={18} />} onClick={addVersion}>
            Add a version
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <ActionIcon
        variant="light"
        color="blue"
        onClick={openEdit}
        sx={{
          height: '30px',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderLeft: '1px solid #dedede',
        }}
      >
        <IconSettings size={18} />
      </ActionIcon>
    </Group>
  );
});
