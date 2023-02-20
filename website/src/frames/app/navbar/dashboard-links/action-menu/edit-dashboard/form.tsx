import { Box, Button, Group, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DashboardAPI } from '../../../../../../api-caller/dashboard';
import { DashboardDetailModelInstance } from '../../../../models/dashboard-store';

interface IFormValues {
  name: string;
  group: string;
}

interface IEditDashboardForm {
  dashboard: DashboardDetailModelInstance;
  postSubmit: () => void;
}

export function EditDashboardForm({ dashboard, postSubmit }: IEditDashboardForm) {
  const [pending, setPending] = useState(false);

  const { control, handleSubmit, watch } = useForm<IFormValues>({
    defaultValues: {
      name: dashboard.name,
      group: dashboard.group,
    },
  });

  const createDashboard = async ({ name, group }: IFormValues) => {
    showNotification({
      id: 'for-updating',
      title: 'Pending',
      message: 'Updating dashboard...',
      loading: true,
    });
    setPending(true);
    try {
      await DashboardAPI.rename({ id: dashboard.id, name, group });
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'Dashboard is updated',
        color: 'green',
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-updating',
        title: 'Failed',
        message: error.message,
        color: 'red',
      });
    } finally {
      setPending(false);
    }
  };

  const [name, group] = watch(['name', 'group']);
  const disabled = !name || !group || (name === dashboard.name && group === dashboard.group);
  return (
    <Box mx="auto" sx={{ position: 'relative' }}>
      <LoadingOverlay visible={pending} />
      <form onSubmit={handleSubmit(createDashboard)}>
        <Stack>
          <Controller
            control={control}
            name="name"
            render={({ field }) => <TextInput label="Name" required {...field} />}
          />
          <Controller
            control={control}
            name="group"
            render={({ field }) => <TextInput label="Group" required {...field} />}
          />
          <Group position="right" mt="md">
            <Button type="submit" disabled={disabled}>
              Confirm
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
}
