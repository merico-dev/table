import { ActionIcon, Button, Group, Stack, Tabs, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { DeviceFloppy, Trash } from 'tabler-icons-react';
import { GlobalVariablesModal } from '~/main/dashboard-editor/settings/content/view-query-vars/query-variables-modal';
import { SQLSnippetModelInstance } from '~/model';
import { MinimalMonacoEditor } from '~/components/minimal-monaco-editor';
import { PreviewSnippet } from './preview-snippet';

interface ISQLSnippetItemEditor {
  item: SQLSnippetModelInstance;
  remove: () => void;
  onKeyChanged: (newKey: string) => void;
}
export const SQLSnippetItemEditor = observer(({ item, remove, onKeyChanged }: ISQLSnippetItemEditor) => {
  // tab
  const [tab, setTab] = useState<string | null>('SQL');

  // key
  const [key, setKey] = useState(item.key);
  const submitKeyChange = () => {
    item.setKey(key);
    onKeyChanged(key);
  };
  const keyChanged = key !== item.key;
  const isADuplicatedKey = item.isADuplicatedKey(key);

  // value
  const [value, setValue] = useState(item.value);
  const submitValueChange = () => {
    item.setValue(value);
  };

  useEffect(() => {
    setKey(item.key);
    setValue(item.value);
  }, [item]);
  const valueChanged = value !== item.value;

  const modals = useModals();
  const removeWithConfirmation = () => {
    modals.openConfirmModal({
      title: 'Delete this SQL snippet?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: remove,
      confirmProps: { color: 'red' },
      zIndex: 320,
    });
  };

  return (
    <Stack p={20} sx={{ maxWidth: '1100px', height: '100vh' }} spacing="sm">
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
        <Button leftIcon={<Trash size={16} />} color="red" variant="light" onClick={removeWithConfirmation}>
          Delete this SQL Snippet
        </Button>
      </Group>
      <Tabs value={tab} onTabChange={setTab} sx={{ flexGrow: 1 }} styles={{ panel: { height: 'calc(100% - 50px)' } }}>
        <Tabs.List sx={{ position: 'relative' }}>
          <Tabs.Tab value="SQL">SQL</Tabs.Tab>
          <Tabs.Tab value="Preview">Preview</Tabs.Tab>
          <GlobalVariablesModal />
          <ActionIcon
            color="blue"
            variant="filled"
            onClick={submitValueChange}
            disabled={!valueChanged}
            sx={{ position: 'absolute', top: 0, right: 10 }}
          >
            <DeviceFloppy size={18} />
          </ActionIcon>
        </Tabs.List>
        <Tabs.Panel value="SQL" pt="sm">
          <MinimalMonacoEditor height="100%" value={value} onChange={setValue} />
        </Tabs.Panel>
        <Tabs.Panel value="Preview" pt="sm">
          <PreviewSnippet value={value} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
