import { Box, Button, FileInput, Group, LoadingOverlay } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DashboardAPI } from '../../../../../api-caller/dashboard';

type TDashboardContent_Temp = Record<string, any> | null; // FIXME: can't use IDashboard, need to fix IDashboard type def first;

interface IFormValues {
  content: TDashboardContent_Temp;
}

export function OverwriteWithJSONForm({ id, name, postSubmit }: { id: string; name: string; postSubmit: () => void }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

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
      content: null,
    },
  });

  const createDashboard = async ({ content }: IFormValues) => {
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
      // @ts-expect-error type mismatch
      await DashboardAPI.update({ id, name, ...content });
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'Dashboard is updated',
        color: 'green',
      });
      postSubmit();
      window.location.reload();
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
    try {
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF-8');
      fileReader.onload = (e) => {
        if (e.target === null) {
          throw new Error('fileReader failed with null result');
        }

        const content = e.target.result;

        console.groupCollapsed('content of the chosen file');
        console.log(content);
        console.groupEnd();

        if (typeof content !== 'string') {
          throw new Error(`unparsable file content of type: ${typeof content}`);
        }

        setValue('content', JSON.parse(content));
      };
      clearErrors('content');
    } catch (error: $TSFixMe | ErrorOptions) {
      setError('content', error);
    }
  }, [file]);

  const [content] = watch(['content']);
  const disabled = !content;
  return (
    <Box mx="auto" sx={{ position: 'relative' }}>
      <LoadingOverlay visible={pending} />
      <form onSubmit={handleSubmit(createDashboard)}>
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
