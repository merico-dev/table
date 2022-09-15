import { ActionIcon, Box, Button, Checkbox, Group, Modal, Select, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRequest } from 'ahooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardAPI } from '../../../api-caller/dashboard';
import { PlaylistAdd } from 'tabler-icons-react';

interface IFormValues {
  name: string;
  idToDuplicate: string;
}

function CreateDashboardForm({ postSubmit }: { postSubmit: () => void }) {
  const navigate = useNavigate();

  const { data: options = [], loading } = useRequest(
    async () => {
      const { data } = await DashboardAPI.list();
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
    formState: { errors, isValidating, isValid },
  } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      idToDuplicate: '',
    },
  });

  const createDashboard = async ({ name, idToDuplicate }: IFormValues) => {
    showNotification({
      id: 'for-creating',
      title: 'Pending',
      message: 'Creating dashboard...',
      loading: true,
    });
    const dashboard = options.find((o) => o.value === idToDuplicate);
    const content = dashboard?.content;
    const { id } = await DashboardAPI.create(name, content);
    updateNotification({
      id: 'for-creating',
      title: 'Successful',
      message: 'A new dashboard is created',
      color: 'green',
    });
    postSubmit();
    navigate(`/dashboard/${id}`);
  };

  const dashboardNameSet = React.useMemo(() => {
    return new Set(options.map((o) => o.label));
  }, [options]);

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(createDashboard)}>
        <Controller
          name="name"
          control={control}
          rules={{
            validate: (v) => !dashboardNameSet.has(v) || 'This name is occupied',
          }}
          render={({ field }) => (
            <TextInput
              mb="md"
              required
              label="Name"
              placeholder="Name the dashboard"
              {...field}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          name="idToDuplicate"
          control={control}
          render={({ field }) => (
            <Select
              my="md"
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
      </form>
    </Box>
  );
}

export function CreateDashboard() {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

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
        <CreateDashboardForm postSubmit={close} />
      </Modal>
      <Button size="xs" onClick={open} leftIcon={<PlaylistAdd size={20} />}>
        Add a new dashboard
      </Button>
    </>
  );
}
