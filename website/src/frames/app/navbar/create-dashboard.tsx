import { Box, Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PlaylistAdd } from 'tabler-icons-react';
import { APICaller } from '../../../api-caller';
import { useDashboardStore } from '../models/dashboard-store-context';

interface IFormValues {
  name: string;
  group: string;
  idToDuplicate: string;
}

function CreateDashboardForm({ postSubmit }: { postSubmit: () => void }) {
  const navigate = useNavigate();

  const { data: options = [], loading } = useRequest(
    async () => {
      const { data } = await APICaller.dashboard.list();
      return data.map((d) => ({
        label: d.name,
        value: d.id,
        content: d.content,
      }));
    },
    {
      refreshDeps: [],
    },
  );

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
    showNotification({
      id: 'for-creating',
      title: 'Pending',
      message: 'Creating dashboard...',
      loading: true,
    });
    const dashboard = options.find((o) => o.value === idToDuplicate);
    const content = dashboard?.content ?? null;
    const { id } = await APICaller.dashboard.create(name, group, content);
    updateNotification({
      id: 'for-creating',
      title: 'Successful',
      message: 'A new dashboard is created',
      color: 'green',
    });
    postSubmit();
    navigate(`/dashboard/${id}/edit`);
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
          <Controller name="group" control={control} render={({ field }) => <TextInput label="Group" {...field} />} />
          <Controller
            name="idToDuplicate"
            control={control}
            render={({ field }) => (
              <Select
                data={options}
                disabled={loading || options.length === 0}
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
        overflow="inside"
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
      <Button size="xs" onClick={open} leftIcon={<PlaylistAdd size={20} />}>
        Add a new dashboard
      </Button>
    </>
  );
});
