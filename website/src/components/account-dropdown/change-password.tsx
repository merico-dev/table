import { IAccount } from '@devtable/settings-form';
import { IStyles } from '@devtable/settings-form/dist/account/styles';
import { Box, Button, Group, LoadingOverlay, Modal, PasswordInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useBoolean } from 'ahooks';
import { Controller, useForm } from 'react-hook-form';
import { AccountAPI } from '../../api-caller/account';

const defaultStyles: IStyles = {
  size: 'sm',
  spacing: 'md',
  button: {
    size: 'xs',
  },
};

interface IFormValues {
  old_password: string;
  new_password: string;
}

interface IChangePasswordForm {
  postSubmit: () => void;
  styles?: IStyles;
}

function ChangePasswordForm({ postSubmit, styles = defaultStyles }: IChangePasswordForm) {
  const [pending, { setTrue, setFalse }] = useBoolean();
  const { control, handleSubmit, watch } = useForm<IFormValues>({
    defaultValues: {
      old_password: '',
      new_password: '',
    },
  });

  watch(['old_password', 'new_password']);

  const update = async ({ old_password, new_password }: IFormValues) => {
    setTrue();
    try {
      showNotification({
        id: 'for-updating',
        title: 'Pending',
        message: 'Changing password...',
        loading: true,
      });
      await AccountAPI.changepassword(old_password, new_password);
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'Your password is changed',
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
    } finally {
      setFalse();
    }
  };

  return (
    <Box mx="auto">
      <LoadingOverlay visible={pending} />
      <form onSubmit={handleSubmit(update)}>
        <Controller
          name="old_password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              autoComplete="off"
              mb={styles.spacing}
              size={styles.size}
              required
              label="Current Password"
              {...field}
            />
          )}
        />

        <Controller
          name="new_password"
          control={control}
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

        <Group position="left" mt={styles.spacing}>
          <Button type="submit" size={styles.button.size} disabled={pending}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

interface IChangePassword {
  opened: boolean;
  onClose: () => void;
}

export function ChangePassword({ opened, onClose }: IChangePassword) {
  const postSubmit = () => {
    onClose();
  };

  return (
    <Modal
      overflow="inside"
      opened={opened}
      onClose={onClose}
      title="Change Password"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      <ChangePasswordForm postSubmit={postSubmit} />
    </Modal>
  );
}
