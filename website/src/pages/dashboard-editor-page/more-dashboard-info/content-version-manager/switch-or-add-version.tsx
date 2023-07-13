import { DashboardContentDBType, initialDashboardContent } from '@devtable/dashboard';
import { ActionIcon, Badge, Button, Group, Menu, Text } from '@mantine/core';
import { IconCaretDown, IconEdit, IconPlaylistAdd, IconVersions } from '@tabler/icons-react';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { APICaller } from '../../../../api-caller';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { DashboardChangelogModalTrigger } from '../dashboard-changlog-modal/changelog-modal-trigger';
import { TModalStates } from '../types';

interface ISwitchOrAddVersion {
  content: DashboardContentDBType;
  reloadOptionsTrigger: number;
  states: TModalStates;
}

export const SwitchOrAddVersion = observer(({ content, reloadOptionsTrigger, states }: ISwitchOrAddVersion) => {
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

  const getIsPublished = (id: string) => {
    return store.currentDetail?.content_id === id;
  };
  return (
    <Group spacing={0}>
      <Menu
        shadow="md"
        width={300}
        trigger="hover"
        openDelay={100}
        closeDelay={400}
        withinPortal
        zIndex={310}
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
            const isPublished = getIsPublished(d.id);
            return (
              <Menu.Item
                key={d.id}
                color={isCurrent ? 'blue' : undefined}
                sx={{ cursor: isCurrent ? 'default' : 'pointer' }}
                onClick={() => switchContent(d.id)}
              >
                <Group position="apart">
                  <Text>{d.name}</Text>

                  {isPublished && (
                    <Badge size="xs" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                      Default
                    </Badge>
                  )}
                </Group>
              </Menu.Item>
            );
          })}
          <Menu.Divider />
          <Menu.Item color="blue" icon={<IconPlaylistAdd size={18} />} onClick={addVersion} py={6}>
            Add a version
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu width={200} trigger="hover" openDelay={100} closeDelay={400} withinPortal zIndex={320}>
        <Menu.Target>
          <ActionIcon
            variant="default"
            // color="light"
            sx={{
              height: '30px',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              svg: { fill: 'rgb(173, 181, 189)', stroke: 'none' },
            }}
          >
            <IconCaretDown size={18} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<IconEdit size={14} />} onClick={states.version.open}>
            Edit version info
          </Menu.Item>
          <DashboardChangelogModalTrigger state={states.changelog} />
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
});
