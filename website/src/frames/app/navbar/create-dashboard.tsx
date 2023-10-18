import { initialDashboardContent } from '@devtable/dashboard';
import { Autocomplete, Box, Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useRequest } from 'ahooks';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { APICaller } from '../../../api-caller';
import { useDashboardStore } from '../models/dashboard-store-context';

async function getInitialContent({
  idToDuplicate,
  options,
}: {
  idToDuplicate?: string;
  options: { label: string; value: string; content_id: string | null }[];
}) {
  if (!idToDuplicate) {
    return {
      name: 'v1',
      content: initialDashboardContent,
    };
  }
  const dashboard = options.find((o) => o.value === idToDuplicate);
  if (!dashboard) {
    throw new Error('Unexpected null dashboard');
  }
  if (!dashboard.content_id) {
    throw new Error('Selected dashboard has no content');
  }
  const c = await APICaller.dashboard_content.details(dashboard.content_id);
  if (!c || !c.content) {
    throw new Error('Selected dashboard has no content');
  }
  return {
    name: 'v1',
    content: c.content,
  };
}

interface IFormValues {
  name: string;
  group: string;
  idToDuplicate: string;
}

function CreateDashboardForm({ postSubmit }: { postSubmit: () => void }) {
  const navigate = useNavigate();

  const { data: dashboards, loading } = useRequest(async (signal) => {
    const { data } = await APICaller.dashboard.list(signal);
    return data;
  });

  const options = useMemo(() => {
    if (!dashboards) {
      return [];
    }
    return dashboards.map((d) => ({
      label: d.name,
      value: d.id,
      content_id: d.content_id,
      group: d.group,
    }));
  }, [dashboards]);

  const groupNames = useMemo(() => {
    if (!dashboards) {
      return [];
    }
    return _.uniq(dashboards.map((d) => d.group).filter((v) => !!v));
  }, [dashboards]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      group: '',
      idToDuplicate: '',
    },
  });

  const createDashboard = async ({ name, group, idToDuplicate }: IFormValues) => {
    try {
      showNotification({
        id: 'for-creating',
        title: 'Pending',
        message: 'Creating dashboard...',
        loading: true,
      });
      const initialContent = await getInitialContent({
        idToDuplicate,
        options,
      });
      updateNotification({
        id: 'for-creating',
        title: 'Pending',
        message: 'Preparing dashboard content...',
        loading: true,
      });
      const d = await APICaller.dashboard.create(name, group);
      updateNotification({
        id: 'for-creating',
        title: 'Pending',
        message: 'Creating dashboard record...',
        loading: true,
      });
      const c = await APICaller.dashboard_content.create({
        ...initialContent,
        dashboard_id: d.id,
      });
      updateNotification({
        id: 'for-creating',
        title: 'Pending',
        message: 'Creating dashboard content record...',
        loading: true,
      });
      await APICaller.dashboard.update({ ...d, content_id: c.id });
      updateNotification({
        id: 'for-creating',
        title: 'Successful',
        message: 'A new dashboard is created',
        color: 'green',
      });
      postSubmit();
      navigate(`/dashboard/${d.id}/edit/${c.id}`);
    } catch (error) {
      updateNotification({
        id: 'for-creating',
        title: 'Failed',
        // @ts-expect-error type of error
        message: error.message,
        color: 'red',
      });
    }
  };

  const dashboardNameSet = React.useMemo(() => {
    return new Set(options.map((o) => o.label));
  }, [options]);

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(createDashboard)}>
        <Stack>
          <Controller
            name="name"
            control={control}
            rules={{
              validate: (v) => !dashboardNameSet.has(v) || 'This name is occupied',
            }}
            render={({ field }) => (
              <TextInput
                required
                label="Name"
                placeholder="Name the dashboard"
                {...field}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            name="group"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disabled={loading}
                withinPortal
                label="Group"
                maxDropdownHeight={500}
                data={groupNames}
                {...field}
              />
            )}
          />
          <Controller
            name="idToDuplicate"
            control={control}
            render={({ field }) => (
              // @ts-expect-error type of onChange
              <Select
                data={options}
                disabled={loading || options.length === 0}
                withinPortal
                maxDropdownHeight={500}
                label="Choose a dashboard to duplicate (optional)"
                {...field}
              />
            )}
          />

          <Group position="right" mt="md">
            <Button type="submit">Confirm</Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
}

export const CreateDashboard = observer(() => {
  const { store } = useDashboardStore();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);

  const closeAndReload = () => {
    setOpened(false);
    store.load();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create a Dashboard"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <CreateDashboardForm postSubmit={closeAndReload} />
      </Modal>
      <Button size="xs" onClick={open} variant="filled" leftIcon={<IconPlus size={16} />}>
        Add a dashboard
      </Button>
    </>
  );
});
