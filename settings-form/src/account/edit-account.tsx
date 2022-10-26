import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import React, { forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Edit } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { IAccount } from '../api-caller/account.typed';
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
  reset_password: boolean;
  new_password: string;
}

interface IEditAccountForm extends Pick<IAccount, 'id' | 'name' | 'email' | 'role_id'> {
  postSubmit: () => void;
  styles?: IStyles;
  roleOptions: { label: string; value: number; description: string }[];
}

function EditAccountForm({
  id,
  name,
  email,
  role_id,
  postSubmit,
  styles = defaultStyles,
  roleOptions,
}: IEditAccountForm) {
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
        name,
        email,
        role_id,
        reset_password,
        new_password,
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
    <Box mx="auto">
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
          <Button type="submit" size={styles.size}>
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
  roleOptions: { label: string; value: number; description: string }[];
  account: IAccount;
}

export function EditAccount({ account, onSuccess, styles = defaultStyles, roleOptions }: IEditAccount) {
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
        title={`Editing ${account.name}`}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <EditAccountForm {...account} postSubmit={postSubmit} styles={styles} roleOptions={roleOptions} />
      </Modal>
      <Button size={styles.size} onClick={open} leftIcon={<Edit size={20} />}>
        Edit
      </Button>
    </>
  );
}
