import { Box, Button, FileInput, Group, LoadingOverlay } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DashboardAPI } from '../../../../../../api-caller/dashboard';
import { validateDashboardJSONFile } from '../../../../../../utils/validate-dashboard-json';
import { DashboardBriefModelInstance } from '../../../../models/dashboard-brief-model';

type TDashboardContent_Temp = Record<string, any> | null; // FIXME: can't use IDashboard, need to fix IDashboard type def first;

interface IFormValues {
  content: TDashboardContent_Temp;
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
    });
    setPending(true);
    try {
      if (!content) {
        throw new Error('please use a valid json file');
      }
      const { id, name, group } = dashboard;
      // @ts-expect-error type mismatch
      await DashboardAPI.update({ id, name, group, ...content });
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
        <Group position="right" mt="md">
          <Button type="submit" disabled={disabled}>
            Confirm
          </Button>
        </Group>
      </form>
    </Box>
  );
}
