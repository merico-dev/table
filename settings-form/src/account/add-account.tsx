import { Box, Button, Group, Modal, PasswordInput, Select, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlaylistAdd } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';

interface IFormValues {
  name: string;
  email: string;
  role_id: number;
  password: string;
}

interface IAddAccountForm {
  postSubmit: () => void;
  styles?: IStyles;
  roleOptions: { label: string; value: number }[];
}

function AddAccountForm({ postSubmit, styles = defaultStyles, roleOptions }: IAddAccountForm) {
  const { control, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      email: '',
      role_id: roleOptions?.[0]?.value ?? 0,
      password: '',
    },
  });

  const addAccount = async ({ name, email, password, role_id }: IFormValues) => {
    try {
      showNotification({
        id: 'for-creating',
        title: 'Pending',
        message: 'Adding account...',
        loading: true,
      });
      await APICaller.account.create(name, email, password, role_id);
      updateNotification({
        id: 'for-creating',
        title: 'Successful',
        message: 'Account is added',
        color: 'green',
      });
      postSubmit();
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
      <form onSubmit={handleSubmit(addAccount)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <TextInput mb={styles.spacing} size={styles.size} required label="Name" {...field} />}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => <TextInput mb={styles.spacing} size={styles.size} required label="Email" {...field} />}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput mb={styles.spacing} size={styles.size} required label="Password" {...field} />
          )}
        />

        <Controller
          name="role_id"
          control={control}
          render={({ field }) => (
            <Select mb={styles.spacing} size={styles.size} required label="Role" data={roleOptions} {...field} />
          )}
        />

        <Group position="right" mt={styles.spacing}>
          <Button type="submit" size={styles.size}>
            Save
          </Button>
        </Group>
      </form>
    </Box>
  );
}

interface IAddAccount {
  styles?: IStyles;
  onSuccess: () => void;
  roleOptions: { label: string; value: number }[];
}

export function AddAccount({ onSuccess, styles = defaultStyles, roleOptions }: IAddAccount) {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = () => {
    onSuccess();
    close();
  };

  return (
    <>
      <Modal
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add an Account"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <AddAccountForm postSubmit={postSubmit} styles={styles} roleOptions={roleOptions} />
      </Modal>
      <Button size={styles.size} onClick={open} leftIcon={<PlaylistAdd size={20} />}>
        Add an Account
      </Button>
    </>
  );
}
