import { Box, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconDeviceFloppy, IconEdit } from '@tabler/icons-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { APICaller } from '../api-caller';
import { TUpdateSQLSnippetPayload } from '../api-caller/sql_snippet.typed';
import { MinimalMonacoEditor } from '../components/minimal-mocaco-editor';
import { IStyles, defaultStyles } from './styles';
import { SubmitFormButton } from '../components';
import { useTranslation } from 'react-i18next';

type TFormValues = TUpdateSQLSnippetPayload;

type TUpdateSQLSnippetFormProps = {
  postSubmit: () => void;
  styles?: IStyles;
} & TFormValues;

function UpdateSQLSnippetForm({ postSubmit, styles = defaultStyles, id, content }: TUpdateSQLSnippetFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<TFormValues>({
    defaultValues: {
      id,
      content,
    },
  });

  const add = async (payload: TFormValues) => {
    try {
      showNotification({
        id: 'for-updating',
        title: t('common.state.pending'),
        message: t('global_sql_snippet.state.updating'),
        loading: true,
        autoClose: false,
      });
      await APICaller.sql_snippet.update(payload);
      updateNotification({
        id: 'for-updating',
        title: t('common.state.successful'),
        message: t('global_sql_snippet.state.updated'),
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-updating',
        title: t('common.state.failed'),
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
              label={t('common.name')}
              placeholder={t('common.name_placeholder')}
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
                {t('global_sql_snippet.content')}
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

type TUpdateSQLSnippetProps = {
  styles?: IStyles;
  onSuccess: () => void;
} & TFormValues;

export function UpdateSQLSnippet({ onSuccess, styles = defaultStyles, ...rest }: TUpdateSQLSnippetProps) {
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
        title={t('global_sql_snippet.edit')}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
        size="80vw"
      >
        <UpdateSQLSnippetForm postSubmit={postSubmit} styles={styles} {...rest} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftIcon={<IconEdit size={18} />}>
        {t('common.actions.edit')}
      </Button>
    </>
  );
}
