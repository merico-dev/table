import { Box, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconDeviceFloppy } from '@tabler/icons-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlaylistAdd } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { TCreateSQLSnippetPayload } from '../api-caller/sql_snippet.typed';
import { MinimalMonacoEditor } from '../components/minimal-mocaco-editor';
import { IStyles, defaultStyles } from './styles';
import { SubmitFormButton } from '../components';
import { useTranslation } from 'react-i18next';

type TFormValues = TCreateSQLSnippetPayload;

interface IAddSQLSnippetForm {
  postSubmit: () => void;
  styles?: IStyles;
}

function AddSQLSnippetForm({ postSubmit, styles = defaultStyles }: IAddSQLSnippetForm) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<TFormValues>({
    defaultValues: {
      id: '',
      content: '',
    },
  });

  const add = async (payload: TFormValues) => {
    try {
      showNotification({
        id: 'for-creating',
        title: t('settings.common.state.pending'),
        message: t('settings.global_sql_snippet.state.adding'),
        loading: true,
        autoClose: false,
      });
      await APICaller.sql_snippet.create(payload);
      updateNotification({
        id: 'for-creating',
        title: t('settings.common.state.successful'),
        message: t('settings.global_sql_snippet.state.added'),
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-creating',
        title: t('settings.common.state.failed'),
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(add)}>
        <Controller
          name="id"
          control={control}
          render={({ field }) => (
            <TextInput
              mb={styles.spacing}
              size={styles.size}
              required
              label={t('settings.common.name')}
              placeholder={t('settings.common.name_placeholder')}
              {...field}
            />
          )}
        />

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Stack spacing={4}>
              <Text size={14} fw={500} color="#212529" sx={{ cursor: 'default' }}>
                {t('settings.global_sql_snippet.content')}
              </Text>
              <MinimalMonacoEditor height="600px" {...field} />
            </Stack>
          )}
        />

        <Group position="right" mt={styles.spacing}>
          <SubmitFormButton size={styles.button.size} />
        </Group>
      </form>
    </Box>
  );
}

interface IAddSQLSnippet {
  styles?: IStyles;
  onSuccess: () => void;
}

export function AddSQLSnippet({ onSuccess, styles = defaultStyles }: IAddSQLSnippet) {
  const { t } = useTranslation();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = () => {
    close();
    onSuccess();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('settings.global_sql_snippet.add')}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
        size="80vw"
      >
        <AddSQLSnippetForm postSubmit={postSubmit} styles={styles} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftIcon={<PlaylistAdd size={18} />}>
        {t('settings.global_sql_snippet.add')}
      </Button>
    </>
  );
}
