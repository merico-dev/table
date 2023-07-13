import { Box, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlaylistAdd } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { TUpdateSQLSnippetPayload } from '../api-caller/sql_snippet.typed';
import { MinimalMonacoEditor } from '../components/minimal-mocaco-editor';
import { IStyles, defaultStyles } from './styles';
import { IconEdit } from '@tabler/icons-react';

type TFormValues = TUpdateSQLSnippetPayload;

type TUpdateSQLSnippetFormProps = {
  postSubmit: () => void;
  styles?: IStyles;
} & TFormValues;

function UpdateSQLSnippetForm({ postSubmit, styles = defaultStyles, id, content }: TUpdateSQLSnippetFormProps) {
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
        title: 'Pending',
        message: 'Updating SQL Snippet...',
        loading: true,
      });
      await APICaller.sql_snippet.update(payload);
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'SQL Snippet is updated',
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

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(add)}>
        <Controller
          name="id"
          control={control}
          render={({ field }) => <TextInput mb={styles.spacing} size={styles.size} required label="Name" {...field} />}
        />

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Stack spacing={4}>
              <Text size={14} fw={500} color="#212529" sx={{ cursor: 'default' }}>
                Content
              </Text>
              <MinimalMonacoEditor height="600px" {...field} />
            </Stack>
          )}
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

type TUpdateSQLSnippetProps = {
  styles?: IStyles;
  onSuccess: () => void;
} & TFormValues;

export function UpdateSQLSnippet({ onSuccess, styles = defaultStyles, ...rest }: TUpdateSQLSnippetProps) {
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
        title="Edit a SQL Snippet"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
        size="80vw"
      >
        <UpdateSQLSnippetForm postSubmit={postSubmit} styles={styles} {...rest} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftIcon={<IconEdit size={18} />}>
        Edit
      </Button>
    </>
  );
}
