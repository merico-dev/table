import { IAccount, IStyles } from '@devtable/settings-form';
import { Box, Button, Group, LoadingOverlay, Modal, Text, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useBoolean } from 'ahooks';
import { Controller, useForm } from 'react-hook-form';
import { APICaller } from '../../api-caller';

const defaultStyles: IStyles = {
  size: 'sm',
  spacing: 'md',
  button: {
    size: 'xs',
  },
};

interface IFormValues {
  name: string;
  email: string;
}

interface IEditAccountForm {
  account: IAccount;
  postSubmit: () => void;
  styles?: IStyles;
}

function EditAccountForm({ account, postSubmit, styles = defaultStyles }: IEditAccountForm) {
  const [pending, { setTrue, setFalse }] = useBoolean();
  const { control, handleSubmit, watch } = useForm<IFormValues>({
    defaultValues: {
      name: account.name,
      email: account.email ?? '',
    },
  });

  watch(['name', 'email']);

  const update = async ({ name, email }: IFormValues) => {
    setTrue();
    try {
      showNotification({
        id: 'for-updating',
        title: 'Pending',
        message: 'Updating profile...',
        loading: true,
        autoClose: false,
      });
      await APICaller.account.update(name, email);
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'Your profile is updated',
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-updating',
        title: 'Failed',
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    } finally {
      setFalse();
    }
  };

  const isSuperAdmin = account.role_id === 'SUPERADMIN';
  return (
    <Box mx="auto">
      <LoadingOverlay visible={pending} />
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

        <Group position="apart" mt={styles.spacing}>
          <Box>
            {isSuperAdmin && (
              <Text size="sm" color="red">
                Can't edit superadmin's profile
              </Text>
            )}
          </Box>
          <Button type="submit" size={styles.button.size} disabled={pending || isSuperAdmin}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

interface IUpdateProfileModal {
  opened: boolean;
  onClose: () => void;
  account: IAccount;
}

export function UpdateProfileModal({ account, opened, onClose }: IUpdateProfileModal) {
  const postSubmit = () => {
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Update Profile"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      <EditAccountForm account={account} postSubmit={postSubmit} />
    </Modal>
  );
}
