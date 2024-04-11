import { ActionIcon, Button, Group, Stack, Tabs, TextInput } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { DeviceFloppy, Trash } from 'tabler-icons-react';
import { QueryVariablesModal } from '~/dashboard-editor/ui/settings/content/view-query-vars/query-variables-modal';
import { MinimalMonacoEditor } from '~/components/widgets/minimal-monaco-editor';
import { PreviewSnippet } from './preview-snippet';
import { SQLSnippetRenderModelInstance } from '~/model';
import { useTranslation } from 'react-i18next';

interface ISQLSnippetItemEditor {
  item: SQLSnippetRenderModelInstance;
  remove: () => void;
  onKeyChanged: (newKey: string) => void;
}
export const SQLSnippetItemEditor = observer(({ item, remove, onKeyChanged }: ISQLSnippetItemEditor) => {
  const { t } = useTranslation();
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
      title: `${t('sql_snippet.delete')}?`,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
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
          label={isADuplicatedKey ? t('sql_snippet.key_occupied') : t('sql_snippet.key')}
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
          {t('sql_snippet.delete')}
        </Button>
      </Group>
      <Tabs value={tab} onTabChange={setTab} sx={{ flexGrow: 1 }} styles={{ panel: { height: 'calc(100% - 50px)' } }}>
        <Tabs.List sx={{ position: 'relative' }}>
          <Tabs.Tab value="SQL">{t('sql_snippet.edit_snippet')}</Tabs.Tab>
          <Tabs.Tab value="Preview">{t('sql_snippet.preview_snippet')}</Tabs.Tab>
          <QueryVariablesModal />
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
          <MinimalMonacoEditor height="100%" value={value} onChange={setValue} defaultLanguage="sql" theme="sql-dark" />
        </Tabs.Panel>
        <Tabs.Panel value="Preview" pt="sm">
          <PreviewSnippet value={value} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
