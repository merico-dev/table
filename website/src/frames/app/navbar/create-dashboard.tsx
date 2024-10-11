import { initialDashboardContent } from '@devtable/dashboard';
import { Autocomplete, Box, Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
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

const CreateDashboardForm = observer(({ postSubmit }: { postSubmit: () => void }) => {
  const navigate = useNavigate();
  const { store } = useDashboardStore();

  const dashboards = store.list;

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
        autoClose: false,
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
        autoClose: false,
      });
      const d = await APICaller.dashboard.create(name, group);
      updateNotification({
        id: 'for-creating',
        title: 'Pending',
        message: 'Creating dashboard record...',
        loading: true,
        autoClose: false,
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
        autoClose: false,
      });
      await APICaller.dashboard.update({ ...d, content_id: c.id });
      updateNotification({
        id: 'for-creating',
        title: 'Successful',
        message: 'A new dashboard is created',
        color: 'green',
        autoClose: true,
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
        autoClose: true,
      });
    }
  };

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(createDashboard)}>
        <Stack>
          <Controller
            name="name"
            control={control}
            rules={{
              validate: (v) => !store.dashboardNameSet.has(v) || 'This name is occupied',
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
                disabled={store.loading}
                comboboxProps={{
                  withinPortal: true,
                }}
                label="Group"
                maxDropdownHeight={500}
                data={store.groupNames}
                {...field}
              />
            )}
          />
          <Controller
            name="idToDuplicate"
            control={control}
            render={({ field }) => (
              <Select
                data={options}
                disabled={store.loading || options.length === 0}
                comboboxProps={{
                  withinPortal: true,
                }}
                maxDropdownHeight={500}
                label="Choose a dashboard to duplicate (optional)"
                {...field}
              />
            )}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Confirm</Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
});

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
      <Button size="xs" onClick={open} variant="filled" leftSection={<IconPlus size={16} />}>
        Add a dashboard
      </Button>
    </>
  );
});
