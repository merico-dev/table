import { Button, Group, Stack, Textarea, TextInput } from '@mantine/core';
import { Trash } from 'tabler-icons-react';
import { SQLSnippetModelInstance } from '~/model';
import { PreviewSnippet } from './preview-snippet';

interface ISQLSnippetItemEditor {
  item: SQLSnippetModelInstance;
  remove: () => void;
}
export const SQLSnippetItemEditor = ({ item, remove }: ISQLSnippetItemEditor) => {
  return (
    <Stack my={0} p={0} pt="md" pr={40}>
      <Group sx={{ alignItems: 'end' }}>
        <TextInput
          label="Key"
          required
          value={item.key}
          onChange={(e) => {
            item.setKey(e.currentTarget.value);
          }}
          // @ts-expect-error important
          sx={{ flexGrow: '1 !important' }}
        />
        <Button leftIcon={<Trash size={16} />} color="red" variant="light" onClick={remove}>
          Delete this SQL Snippet
        </Button>
      </Group>
      <Textarea
        minRows={3}
        label="Value"
        required
        value={item.value}
        onChange={(e) => {
          item.setValue(e.currentTarget.value);
        }}
        className="code-textarea"
      />
      <PreviewSnippet value={item.value} />
    </Stack>
  );
};
