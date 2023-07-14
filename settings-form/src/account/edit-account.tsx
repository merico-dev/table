import { Box, Button, Divider, Group, Modal, PasswordInput, Switch, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Edit } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { IAccount } from '../api-caller/account.typed';
import { RoleSelector } from './role-selector';
import { defaultStyles, IStyles } from './styles';

interface IFormValues {
  name: string;
  email: string;
  role_id: string;
  reset_password: boolean;
  new_password: string;
}

interface IEditAccountForm extends Pick<IAccount, 'id' | 'name' | 'email' | 'role_id'> {
  postSubmit: () => void;
  styles?: IStyles;
}

function EditAccountForm({ id, name, email, role_id, postSubmit, styles = defaultStyles }: IEditAccountForm) {
  const { control, handleSubmit, watch } = useForm<IFormValues>({
    defaultValues: {
      name,
      email,
      role_id,
      reset_password: false,
      new_password: '',
    },
  });

  const update = async ({ name, email, role_id, reset_password, new_password }: IFormValues) => {
    try {
      showNotification({
        id: 'for-updating',
        title: 'Pending',
        message: 'Updating account...',
        loading: true,
      });
      await APICaller.account.edit({
        id,
        name: name.trim(),
        email: email.trim(),
        role_id,
        reset_password,
        new_password: new_password.trim(),
      });
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'Account is updated',
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
    }
  };

  const [reset_password, new_password] = watch(['reset_password', 'new_password']);

  return (
    <Box mx="auto" mb={10}>
      <form onSubmit={handleSubmit(update)}>
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
          name="role_id"
          control={control}
          render={({ field }) => <RoleSelector styles={styles} {...field} />}
        />

        <Divider my={20} variant="dashed" label="" labelPosition="center" />

        <Controller
          name="reset_password"
          control={control}
          render={({ field }) => (
            <Switch
              mb={styles.spacing}
              size={styles.size}
              label="Reset password"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
              styles={{
                label: {
                  verticalAlign: 'middle',
                },
              }}
            />
          )}
        />

        {reset_password && (
          <Controller
            name="new_password"
            control={control}
            // rules={{
            //   validate: (v) => {
            //     return v.length >= 8 || 'At least 8 characters long';
            //   },
            // }}
            render={({ field }) => (
              <PasswordInput
                autoComplete="off"
                mb={styles.spacing}
                size={styles.size}
                required
                description="Password must be at least 8 characters long"
                label="New Password"
                {...field}
              />
            )}
          />
        )}

        <Group position="right" mt={styles.spacing}>
          <Button type="submit" size={styles.button.size}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

interface IEditAccount {
  styles?: IStyles;
  onSuccess: () => void;
  account: IAccount;
}

export function EditAccount({ account, onSuccess, styles = defaultStyles }: IEditAccount) {
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
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Editing ${account.name}`}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <EditAccountForm {...account} postSubmit={postSubmit} styles={styles} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftIcon={<Edit size={20} />}>
        Edit
      </Button>
    </>
  );
}
