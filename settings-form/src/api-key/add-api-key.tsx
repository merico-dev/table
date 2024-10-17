import { Box, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { closeAllModals, useModals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RoleSelector } from '../account/role-selector';
import { APICaller } from '../api-caller';
import { SubmitFormButton } from '../components';
import { IStyles, defaultStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { IconPlaylistAdd } from '@tabler/icons-react';

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
  const { t } = useTranslation();
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
        title: t('common.state.pending'),
        message: t('api_key.state.adding'),
        loading: true,
        autoClose: false,
      });
      const { app_id, app_secret } = await APICaller.api_key.create(name, role_id);
      updateNotification({
        id: 'for-creating',
        title: t('common.state.successful'),
        message: t('api_key.state.added'),
        color: 'green',
        autoClose: true,
      });
      postSubmit(app_id, app_secret);
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
      <form onSubmit={handleSubmit(addAPIKey)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label={t('common.name')} {...field} />
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

interface IAddAPIKey {
  styles?: IStyles;
  onSuccess: () => void;
  initialRoleID: string;
}

export function AddAPIKey({ onSuccess, styles = defaultStyles, initialRoleID }: IAddAPIKey) {
  const { t } = useTranslation();
  const modals = useModals();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = (app_id: string, app_secret: string) => {
    close();
    modals.openModal({
      title: t('api_key.save.title'),
      children: (
        <Stack>
          <Text color="dimmed">{t('api_key.save.warn')}</Text>
          <TextInput
            defaultValue={app_id}
            disabled
            label={t('api_key.app_id')}
            styles={{ input: { cursor: 'text !important' } }}
          />
          <TextInput
            defaultValue={app_secret}
            disabled
            label={t('api_key.app_secret')}
            styles={{ input: { cursor: 'text !important' } }}
          />
          <Button
            size="sm"
            onClick={() => {
              closeAllModals();
            }}
          >
            {t('api_key.save.saved')}
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
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('api_key.add')}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <AddAPIKeyForm postSubmit={postSubmit} styles={styles} initialRoleID={initialRoleID} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftSection={<IconPlaylistAdd size={20} />}>
        {t('api_key.add')}
      </Button>
    </>
  );
}
