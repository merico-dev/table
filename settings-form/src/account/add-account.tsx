import { Box, Button, Group, Modal, PasswordInput, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlaylistAdd } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { RoleSelector } from './role-selector';
import { IStyles, defaultStyles } from './styles';

interface IFormValues {
  name: string;
  email: string;
  role_id: string;
  password: string;
}

interface IAddAccountForm {
  postSubmit: () => void;
  styles?: IStyles;
  initialRoleID: string;
}

function AddAccountForm({ postSubmit, styles = defaultStyles, initialRoleID }: IAddAccountForm) {
  const { control, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      email: '',
      role_id: initialRoleID,
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
    <Box mx="auto" mb={10}>
      <form onSubmit={handleSubmit(addAccount)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label="Username" {...field} />
          )}
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
            <PasswordInput
              mb={styles.spacing}
              size={styles.size}
              required
              label="Password"
              description="Password must be at least 8 characters long"
              {...field}
            />
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

interface IAddAccount {
  styles?: IStyles;
  onSuccess: () => void;
  initialRoleID: string;
}

export function AddAccount({ onSuccess, styles = defaultStyles, initialRoleID }: IAddAccount) {
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
        <AddAccountForm postSubmit={postSubmit} styles={styles} initialRoleID={initialRoleID} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftIcon={<PlaylistAdd size={20} />}>
        Add an Account
      </Button>
    </>
  );
}
