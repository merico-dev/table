import { ActionIcon, Tabs } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { cast } from 'mobx-state-tree';
import { Plus } from 'tabler-icons-react';
import { useModelContext } from '../../contexts';
import { SQLSnippetItemEditor } from './item-editor';

export const SQLSnippetsEditor = observer(function _SQLSnippetsEditor() {
  const model = useModelContext();

  const addSnippet = () =>
    model.sqlSnippets.append(
      cast({
        key: randomId(),
        value: '',
      }),
    );

  return (
    <Tabs defaultValue={'0'}>
      <Tabs.List>
        {model.sqlSnippets.current.map((item, index) => (
          <Tabs.Tab value={index.toString()}>{index + 1}</Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addSnippet} value="add">
          <ActionIcon>
            <Plus size={18} color="#228be6" />
          </ActionIcon>
        </Tabs.Tab>
      </Tabs.List>
      {model.sqlSnippets.current.map((item, index) => (
        <Tabs.Panel value={index.toString()}>
          <SQLSnippetItemEditor key={index.toString()} item={item} remove={() => model.sqlSnippets.remove(index)} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
});
