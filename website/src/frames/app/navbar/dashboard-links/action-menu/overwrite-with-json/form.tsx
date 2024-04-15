import { TDashboardContent } from '@devtable/dashboard';
import { Box, Button, FileInput, Group, LoadingOverlay } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { APICaller } from '../../../../../../api-caller';
import { validateDashboardJSONFile } from '../../../../../../utils/validate-dashboard-json';
import { DashboardBriefModelInstance } from '../../../../models/dashboard-brief-model';

async function createContent(dashboard: DashboardBriefModelInstance, content: TDashboardContent) {
  const c = await APICaller.dashboard_content.create({ name: 'v1', content, dashboard_id: dashboard.id });
  const { id, name, group } = dashboard;
  await APICaller.dashboard.update({ content_id: c.id, id, name, group });
}

async function overwriteContent(dashboard: DashboardBriefModelInstance, content: TDashboardContent) {
  const { content_id } = dashboard;
  if (!content_id) {
    return await createContent(dashboard, content);
  }
  const c = await APICaller.dashboard_content.details(content_id);
  if (!c) {
    return await createContent(dashboard, content);
  }
  await APICaller.dashboard_content.update({ ...c, content });
}

interface IFormValues {
  content: TDashboardContent | null;
}

export function OverwriteWithJSONForm({
  dashboard,
  postSubmit,
}: {
  dashboard: DashboardBriefModelInstance;
  postSubmit: () => void;
}) {
  const [pending, setPending] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<IFormValues>({
    defaultValues: {
      content: null,
    },
  });

  const updateDashboardWithJSON = async ({ content }: IFormValues) => {
    showNotification({
      id: 'for-updating',
      title: 'Pending',
      message: 'Updating dashboard...',
      loading: true,
      autoClose: false,
    });
    setPending(true);
    try {
      if (!content) {
        throw new Error('please use a valid json file');
      }
      await overwriteContent(dashboard, content);
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'Dashboard is updated',
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-updating',
        title: 'Failed',
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    } finally {
      setPending(false);
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

  const [content] = watch(['content']);
  const disabled = !content;
  return (
    <Box mx="auto" sx={{ position: 'relative' }}>
      <LoadingOverlay visible={pending} />
      <form onSubmit={handleSubmit(updateDashboardWithJSON)}>
        <FileInput label="JSON File" required value={file} onChange={setFile} error={errors?.content?.message} />
        <Group position="right" my="md">
          <Button type="submit" disabled={disabled}>
            Confirm
          </Button>
        </Group>
      </form>
    </Box>
  );
}
