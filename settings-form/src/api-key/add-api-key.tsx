import { Box, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { closeAllModals, useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlaylistAdd } from 'tabler-icons-react';
import { RoleSelector } from '../account/role-selector';
import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';

interface IFormValues {
  name: string;
  role_id: string;
}

interface IAddAPIKeyForm {
  postSubmit: (app_id: string, app_secret: string) => void;
  styles?: IStyles;
  initialRoleID: string;
}

function AddAPIKeyForm({ postSubmit, styles = defaultStyles, initialRoleID }: IAddAPIKeyForm) {
  const { control, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      role_id: initialRoleID,
    },
  });

  const addAPIKey = async ({ name, role_id }: IFormValues) => {
    try {
      showNotification({
        id: 'for-creating',
        title: 'Pending',
        message: 'Adding API Key...',
        loading: true,
      });
      const { app_id, app_secret } = await APICaller.api_key.create(name, role_id);
      updateNotification({
        id: 'for-creating',
        title: 'Successful',
        message: 'API Key is added',
        color: 'green',
      });
      postSubmit(app_id, app_secret);
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-creating',
        title: 'Failed',
        message: error.message,
        color: 'red',
      });
    }
  };

  return (
    <Box mx="auto" mb={10}>
      <form onSubmit={handleSubmit(addAPIKey)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <TextInput mb={styles.spacing} size={styles.size} required label="Name" {...field} />}
        />

        <Controller
          name="role_id"
          control={control}
          render={({ field }) => <RoleSelector styles={styles} {...field} />}
        />

        <Group position="right" mt={styles.spacing}>
          <Button type="submit" size={styles.button.size}>
            Save
          </Button>
        </Group>
      </form>
    </Box>
  );
}

interface IAddAPIKey {
  styles?: IStyles;
  onSuccess: () => void;
  initialRoleID: string;
}

export function AddAPIKey({ onSuccess, styles = defaultStyles, initialRoleID }: IAddAPIKey) {
  const modals = useModals();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = (app_id: string, app_secret: string) => {
    close();
    modals.openModal({
      title: 'API Key is generated',
      children: (
        <Stack>
          <Text color="dimmed">Make sure you save it - you won't be able to access it again.</Text>
          <TextInput defaultValue={app_id} disabled label="APP ID" styles={{ input: { cursor: 'text !important' } }} />
          <TextInput
            defaultValue={app_secret}
            disabled
            label="APP Secret"
            styles={{ input: { cursor: 'text !important' } }}
          />
          <Button
            size="sm"
            onClick={() => {
              closeAllModals();
            }}
          >
            I've saved this API Key
          </Button>
        </Stack>
      ),
      onClose: () => {
        onSuccess();
      },
    });
  };

  return (
    <>
      <Modal
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add an API Key"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <AddAPIKeyForm postSubmit={postSubmit} styles={styles} initialRoleID={initialRoleID} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftIcon={<PlaylistAdd size={20} />}>
        Add an API Key
      </Button>
    </>
  );
}
