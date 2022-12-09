import { ActionIcon, Button, Group, Stack, Tabs, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DeviceFloppy, Trash } from 'tabler-icons-react';
import { SQLSnippetModelInstance } from '~/model';
import { MinimalMonacoEditor } from '../minimal-monaco-editor';
import { PreviewSnippet } from './preview-snippet';

interface ISQLSnippetItemEditor {
  item: SQLSnippetModelInstance;
  remove: () => void;
}
export const SQLSnippetItemEditor = observer(({ item, remove }: ISQLSnippetItemEditor) => {
  // tab
  const [tab, setTab] = useState<string>('SQL');
  const changeTab = (t: string) => {
    if (t === 'Submit') {
      return;
    }
    setTab(t);
  };
  // key
  const [key, setKey] = useState(item.key);
  const submitKeyChange = () => {
    item.setKey(key);
  };
  const keyChanged = key !== item.key;
  const isADuplicatedKey = item.isADuplicatedKey(key);

  // value
  const [value, setValue] = useState(item.value);
  const submitValueChange = () => {
    item.setValue(value);
  };
  const valueChanged = value !== item.value;
  return (
    <Stack my={0} p={0} pt="md" pr={20}>
      <Group sx={{ alignItems: 'end' }} spacing={40}>
        <TextInput
          label={isADuplicatedKey ? 'This key is occupied by another snippet' : 'Key'}
          value={key}
          onChange={(e) => {
            setKey(e.currentTarget.value);
          }}
          // @ts-expect-error important
          sx={{ flexGrow: '1 !important' }}
          rightSection={
            <ActionIcon
              color="blue"
              variant="subtle"
              onClick={submitKeyChange}
              disabled={!keyChanged || isADuplicatedKey}
            >
              <DeviceFloppy size={16} />
            </ActionIcon>
          }
          error={isADuplicatedKey}
        />
        <Button leftIcon={<Trash size={16} />} color="red" variant="light" onClick={remove}>
          Delete this SQL Snippet
        </Button>
      </Group>
      <Tabs value={tab} onTabChange={changeTab}>
        <Tabs.List>
          <Tabs.Tab value="SQL">SQL</Tabs.Tab>
          <Tabs.Tab value="Preview">Preview</Tabs.Tab>
          <Tabs.Tab value="Submit" ml="auto" onClick={submitValueChange} disabled={!valueChanged}>
            <ActionIcon>
              <DeviceFloppy size={18} color="#40c057" />
            </ActionIcon>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="SQL" pt="sm">
          <MinimalMonacoEditor height="400px" value={value} onChange={setValue} />
        </Tabs.Panel>
        <Tabs.Panel value="Preview" pt="sm">
          <PreviewSnippet value={value} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
