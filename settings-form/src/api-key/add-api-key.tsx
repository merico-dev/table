import { Box, Button, Group, Modal, Stack, TextInput } from '@mantine/core';
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
  role_id: number;
  domain: string;
}

interface IAddAPIKeyForm {
  postSubmit: (key: string) => void;
  styles?: IStyles;
  initialRoleID: number;
}

function AddAPIKeyForm({ postSubmit, styles = defaultStyles, initialRoleID }: IAddAPIKeyForm) {
  const { control, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      role_id: initialRoleID,
      domain: '',
    },
  });

  const addAPIKey = async ({ name, role_id, domain }: IFormValues) => {
    try {
      showNotification({
        id: 'for-creating',
        title: 'Pending',
        message: 'Adding API Key...',
        loading: true,
      });
      const key = await APICaller.api_key.create(name, role_id, domain);
      updateNotification({
        id: 'for-creating',
        title: 'Successful',
        message: 'API Key is added',
        color: 'green',
      });
      postSubmit(key);
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
    <Box mx="auto">
      <form onSubmit={handleSubmit(addAPIKey)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <TextInput mb={styles.spacing} size={styles.size} required label="Name" {...field} />}
        />

        <Controller
          name="domain"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label="Domain" {...field} />
          )}
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
  initialRoleID: number;
}

export function AddAPIKey({ onSuccess, styles = defaultStyles, initialRoleID }: IAddAPIKey) {
  const modals = useModals();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = (key: string) => {
    close();
    modals.openModal({
      title: 'API Key is generated',
      children: (
        <Stack>
          <TextInput
            defaultValue={key}
            disabled
            label="Generated API Key"
            description="Make sure you save it - you won't be able to access it again."
            styles={{ input: { cursor: 'text !important' } }}
          />
          <Button
            size="sm"
            onClick={() => {
              closeAllModals();
              onSuccess();
            }}
          >
            I've saved this API Key
          </Button>
        </Stack>
      ),
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
