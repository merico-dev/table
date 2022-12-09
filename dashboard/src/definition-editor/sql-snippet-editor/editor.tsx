import { ActionIcon, Button, Group, Stack, Tabs, Text, Textarea, TextInput } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { cast } from 'mobx-state-tree';
import { Plus, Trash } from 'tabler-icons-react';
import { useModelContext } from '../../contexts';
import { PreviewSnippet } from './preview-snippet';

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
          <Stack key={index} my={0} p="md" pr={40}>
            <TextInput
              label="Key"
              required
              value={item.key}
              onChange={(e) => {
                item.setKey(e.currentTarget.value);
              }}
            />
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

            <Button
              mt={20}
              leftIcon={<Trash size={16} />}
              color="red"
              variant="light"
              onClick={() => model.sqlSnippets.remove(index)}
            >
              Delete this SQL Snippet
            </Button>
          </Stack>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
});
