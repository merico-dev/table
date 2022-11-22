import { ActionIcon, Box, Button, FileInput, Group, LoadingOverlay, Modal, TextInput, Tooltip } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRequest } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FileImport } from 'tabler-icons-react';
import { DashboardAPI } from '../../../api-caller/dashboard';

type TDashboardContent_Temp = Record<string, any> | null; // FIXME: can't use IDashboard, need to fix IDashboard type def first;

interface IFormValues {
  name: string;
  content: TDashboardContent_Temp;
}

function ImportDashboardForm({ postSubmit }: { postSubmit: () => void }) {
  const navigate = useNavigate();

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
      content: null,
    },
  });

  const createDashboard = async ({ name, content }: IFormValues) => {
    showNotification({
      id: 'for-creating',
      title: 'Pending',
      message: 'Creating dashboard...',
      loading: true,
    });
    try {
      if (!content) {
        throw new Error('please use a valid json file');
      }
      const { id } = await DashboardAPI.create(name, content);
      updateNotification({
        id: 'for-creating',
        title: 'Successful',
        message: 'A new dashboard is created',
        color: 'green',
      });
      postSubmit();
      navigate(`/dashboard/${id}`);
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-creating',
        title: 'Failed',
        message: error.message,
        color: 'red',
      });
    }
  };

  const { data: nameSet = new Set<string>(), loading } = useRequest(
    async () => {
      const { data } = await DashboardAPI.list();
      return new Set(data.map((o) => o.name));
    },
    {
      refreshDeps: [],
    },
  );

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

  const [name, content] = watch(['name', 'content']);
  const disabled = !name || !content;
  return (
    <Box mx="auto" sx={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <form onSubmit={handleSubmit(createDashboard)}>
        <Controller
          name="name"
          control={control}
          rules={{
            validate: (v: string) => !nameSet.has(v) || 'This name is occupied',
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

export function ImportDashboard() {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);

  return (
    <>
      <Modal
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Import a dashboard from JSON file"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <ImportDashboardForm postSubmit={close} />
      </Modal>
      <Tooltip label="Import a dashboard">
        <ActionIcon color="blue" variant="light" onClick={open}>
          <FileImport size={17} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
