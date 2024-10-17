import { Box, Button, Group, Modal, PasswordInput, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IconPlaylistAdd } from '@tabler/icons-react';
import { APICaller } from '../api-caller';
import { SubmitFormButton } from '../components';
import { RoleSelector } from './role-selector';
import { IStyles, defaultStyles } from './styles';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
        title: t('common.state.pending'),
        message: t('account.state.adding'),
        loading: true,
        autoClose: false,
      });
      await APICaller.account.create(name, email, password, role_id);
      updateNotification({
        id: 'for-creating',
        title: t('common.state.successful'),
        message: t('account.state.added'),
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-creating',
        title: t('common.state.failed'),
        message: error.message,
        color: 'red',
        autoClose: true,
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
            <TextInput mb={styles.spacing} size={styles.size} required label={t('account.username')} {...field} />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label={t('account.email')} {...field} />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              mb={styles.spacing}
              size={styles.size}
              required
              label={t('account.password')}
              description={t('account.password_hint')}
              {...field}
            />
          )}
        />

        <Controller
          name="role_id"
          control={control}
          render={({ field }) => <RoleSelector styles={styles} {...field} />}
        />

        <Group justify="flex-end" mt={styles.spacing}>
          <SubmitFormButton size={styles.button.size} />
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
  const { t } = useTranslation();
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
        title={t('account.add')}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <AddAccountForm postSubmit={postSubmit} styles={styles} initialRoleID={initialRoleID} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftIcon={<IconPlaylistAdd size={20} />}>
        {t('account.add')}
      </Button>
    </>
  );
}
