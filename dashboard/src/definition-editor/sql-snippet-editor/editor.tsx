import { ActionIcon, Tabs } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { cast } from 'mobx-state-tree';
import { useState } from 'react';
import { Plus } from 'tabler-icons-react';
import { useModelContext } from '../../contexts';
import { SQLSnippetItemEditor } from './item-editor';

export const SQLSnippetsEditor = observer(function _SQLSnippetsEditor() {
  const model = useModelContext();
  const [tab, setTab] = useState<string | null>(model.sqlSnippets.firstKey ?? null);

  const addSnippet = () => {
    const key = randomId();
    model.sqlSnippets.append(
      cast({
        key,
        value: '',
      }),
    );
    setTab(key);
  };

  const onKeyChanged = (newKey: string) => {
    setTab(newKey);
  };

  const getRemoveHandler = (index: number) => () => {
    model.sqlSnippets.remove(index);
    setTab(model.sqlSnippets.firstKey ?? null);
  };

  return (
    <Tabs defaultValue={tab} value={tab} onTabChange={setTab}>
      <Tabs.List>
        {model.sqlSnippets.current.map((item) => (
          <Tabs.Tab key={item.key} value={item.key}>
            {item.key}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addSnippet} value="add">
          <ActionIcon>
            <Plus size={18} color="#228be6" />
          </ActionIcon>
        </Tabs.Tab>
      </Tabs.List>
      {model.sqlSnippets.current.map((item, index) => (
        <Tabs.Panel key={item.key} value={item.key}>
          <SQLSnippetItemEditor item={item} remove={getRemoveHandler(index)} onKeyChanged={onKeyChanged} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
});
