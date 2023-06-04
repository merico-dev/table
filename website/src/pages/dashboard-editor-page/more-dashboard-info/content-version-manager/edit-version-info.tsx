import { DashboardContentDBType } from '@devtable/dashboard';
import { ActionIcon, Box, Group, Stack, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconDeviceFloppy } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { Controller, useForm } from 'react-hook-form';
import { APICaller } from '../../../../api-caller';
import { ErrorBoundary } from '../../../../utils/error-boundary';
import { DeleteVersion } from './delete-version';
import { SetAsDefaultVersion } from './set-as-default-version';

type TProps = Pick<DashboardContentDBType, 'id' | 'name' | 'create_time' | 'update_time'> & {
  postSubmit: (newName?: string) => void;
};

type TFormValues = Pick<DashboardContentDBType, 'id' | 'name'>;

export const EditVersionInfo = observer(({ id, name, create_time, update_time, postSubmit }: TProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormValues>({
    defaultValues: {
      id,
      name,
    },
  });

  const updateVersionInfo = async ({ id, name }: TFormValues) => {
    try {
      showNotification({
        id: 'for-updating',
        title: 'Pending',
        message: 'Updating version info...',
        loading: true,
      });
      await APICaller.dashboard_content.update({
        id,
        name,
      });
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'Version is updated',
        color: 'green',
      });
      postSubmit(name);
    } catch (error) {
      updateNotification({
        id: 'for-updating',
        title: 'Failed',
        // @ts-expect-error type of error
        message: error.message,
        color: 'red',
      });
    }
  };

  return (
    <Box p="md">
      <ErrorBoundary>
        <form onSubmit={handleSubmit(updateVersionInfo)}>
          <Stack>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  required
                  label="Version Name"
                  {...field}
                  error={errors.name?.message}
                  rightSection={
                    <ActionIcon type="submit" variant="filled" color="blue" disabled={field.value === name}>
                      <IconDeviceFloppy size={18} />
                    </ActionIcon>
                  }
                />
              )}
            />
            <TextInput label="Created At" value={create_time} readOnly />
            <TextInput label="Updated At" value={update_time} readOnly />
            <Group position="apart" mt="md">
              <DeleteVersion id={id} postSubmit={postSubmit} />
              <SetAsDefaultVersion id={id} postSubmit={postSubmit} />
            </Group>
          </Stack>
        </form>
      </ErrorBoundary>
    </Box>
  );
});
