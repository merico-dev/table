import { ActionIcon, Button, Group, Stack, Tabs, TextInput } from '@mantine/core';
import { useState } from 'react';
import { DeviceFloppy, Trash } from 'tabler-icons-react';
import { SQLSnippetModelInstance } from '~/model';
import { MinimalMonacoEditor } from '../minimal-monaco-editor';
import { PreviewSnippet } from './preview-snippet';

interface ISQLSnippetItemEditor {
  item: SQLSnippetModelInstance;
  remove: () => void;
}
export const SQLSnippetItemEditor = ({ item, remove }: ISQLSnippetItemEditor) => {
  const [key, setKey] = useState(item.key);
  const submitKeyChange = () => {
    item.setKey(key);
  };
  const keyChanged = key !== item.key;
  return (
    <Stack my={0} p={0} pt="md" pr={20}>
      <Group sx={{ alignItems: 'end' }} spacing={40}>
        <TextInput
          label="Key"
          required
          value={key}
          onChange={(e) => {
            setKey(e.currentTarget.value);
          }}
          // @ts-expect-error important
          sx={{ flexGrow: '1 !important' }}
          rightSection={
            <ActionIcon color="blue" variant="subtle" onClick={submitKeyChange} disabled={!keyChanged}>
              <DeviceFloppy size={16} />
            </ActionIcon>
          }
        />
        <Button leftIcon={<Trash size={16} />} color="red" variant="light" onClick={remove}>
          Delete this SQL Snippet
        </Button>
      </Group>
      <Tabs defaultValue="SQL">
        <Tabs.List>
          <Tabs.Tab value="SQL">SQL</Tabs.Tab>
          <Tabs.Tab value="Preview">Preview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="SQL" pt="sm">
          <MinimalMonacoEditor height="400px" value={item.value} onChange={item.setValue} />
        </Tabs.Panel>
        <Tabs.Panel value="Preview" pt="sm">
          <PreviewSnippet value={item.value} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
