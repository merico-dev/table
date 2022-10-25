import { Box, Button, Group, Modal, PasswordInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import React, { forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlaylistAdd } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { defaultStyles, IStyles } from './styles';

interface IRoleOptionItem {
  label: string;
  value: string;
  description: string;
}

const RoleOptionItem = forwardRef<HTMLDivElement, IRoleOptionItem>(
  ({ label, value, description, ...others }: IRoleOptionItem, ref) => (
    <Stack spacing={2} ref={ref} {...others}>
      <Text size="sm">{label}</Text>
      <Text size="xs" color="dimmed" className="role-description">
        {description}
      </Text>
    </Stack>
  ),
);

interface IFormValues {
  name: string;
  email: string;
  role_id: number;
  password: string;
}

interface IAddAccountForm {
  postSubmit: () => void;
  styles?: IStyles;
  roleOptions: { label: string; value: number; description: string }[];
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
            <Select
              mb={styles.spacing}
              size={styles.size}
              required
              label="Role"
              itemComponent={RoleOptionItem}
              // @ts-expect-error value type
              data={roleOptions}
              styles={() => ({
                item: {
                  '&[data-selected]': {
                    '&, &:hover': {
                      '.role-description': {
                        color: 'rgba(255,255,255,.8)',
                      },
                    },
                  },
                },
              })}
              {...field}
            />
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
  roleOptions: { label: string; value: number; description: string }[];
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
