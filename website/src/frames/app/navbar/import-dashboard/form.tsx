import { Autocomplete, Box, Button, FileInput, Group, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { TDashboardContent } from '@devtable/dashboard';
import { observer } from 'mobx-react-lite';
import { APICaller } from '../../../../api-caller';
import { validateDashboardJSONFile } from '../../../../utils/validate-dashboard-json';
import { useDashboardStore } from '../../models/dashboard-store-context';

const cleanContent = (c: TDashboardContent | null) => {
  if (!c) {
    throw new Error('Unexpected empty file');
  }
  return c;
};

interface IFormValues {
  name: string;
  group: string;
  content: TDashboardContent | null;
}

export const ImportDashboardForm = observer(({ postSubmit }: { postSubmit: () => void }) => {
  const navigate = useNavigate();
  const { store } = useDashboardStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      group: '',
      content: null,
    },
  });

  const createDashboardWithJSON = async ({ name, group, content }: IFormValues) => {
    showNotification({
      id: 'for-creating',
      title: 'Pending',
      message: 'Creating dashboard...',
      loading: true,
      autoClose: false,
    });
    try {
      if (!content) {
        throw new Error('please use a valid json file');
      }
      const finalContent = cleanContent(content);
      const d = await APICaller.dashboard.create(name, group);
      const c = await APICaller.dashboard_content.create({
        dashboard_id: d.id,
        name: 'v1',
        content: finalContent,
      });
      await APICaller.dashboard.update({ ...d, content_id: c.id });
      updateNotification({
        id: 'for-creating',
        title: 'Successful',
        message: 'A new dashboard is created',
        color: 'green',
        loading: false,
        autoClose: true,
      });
      postSubmit();
      navigate(`/dashboard/${d.id}/edit/${c.id}`);
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-creating',
        title: 'Failed',
        message: error.message,
        color: 'red',
        loading: false,
        autoClose: true,
      });
    }
  };

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (e) => {
      try {
        const content = validateDashboardJSONFile(e);
        setValue('content', content);
        clearErrors('content');
      } catch (error: $TSFixMe | ErrorOptions) {
        console.error(error);
        setError('content', { type: 'custom', message: error.message });
      }
    };
    fileReader.onabort = () => console.log('🟨 abort');
    fileReader.onerror = () => {
      if (fileReader.error) {
        console.error(fileReader.error);
        setError('content', { type: 'custom', message: fileReader.error.message });
      }
    };
  }, [file]);

  const [name, content] = watch(['name', 'content']);
  const disabled = !name || !content;
  return (
    <Box mx="auto" sx={{ position: 'relative' }}>
      <LoadingOverlay visible={store.loading} />
      <form onSubmit={handleSubmit(createDashboardWithJSON)}>
        <Stack>
          <Controller
            name="name"
            control={control}
            rules={{
              validate: (v: string) => !store.dashboardNameSet.has(v) || 'This name is occupied',
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
          <FileInput label="JSON File" required value={file} onChange={setFile} error={errors?.content?.message} />
          <Group justify="flex-end" my="md">
            <Button type="submit" disabled={disabled}>
              Confirm
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
});
