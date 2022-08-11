import { ActionIcon, Button, Group, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { cast } from 'mobx-state-tree';
import { randomId } from '@mantine/hooks';
import _ from 'lodash';
import { Trash } from 'tabler-icons-react';
import { DashboardModelInstance } from '../../model';
import { PreviewSnippet } from './preview-snippet';

interface ISQLSnippetsEditor {
  model: DashboardModelInstance;
}

export function SQLSnippetsEditor({ model }: ISQLSnippetsEditor) {
  const addSnippet = () =>
    model.sqlSnippets.append(cast({
      key: randomId(),
      value: '',
    }));

  return (
    <Stack sx={{ border: '1px solid #eee', flexGrow: 1 }}>
      <Group
        position="left"
        pl="md"
        py="md"
        sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}
      >
        <Text weight={500}>SQL Snippets</Text>
      </Group>
      <Group px="md" pb="md" pt="md">
        <Stack sx={{ width: '100%', position: 'relative' }}>
          {model.sqlSnippets.current.map((item, index) => (
            <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
              <TextInput label="Key" required value={item.key} onChange={(e) => { item.setKey(e.currentTarget.value) }} />
              <Textarea
                minRows={3}
                label="Value"
                required
                value={item.value} onChange={(e) => { item.setValue(e.currentTarget.value) }}
                className="code-textarea"
              />
              <PreviewSnippet value={item.value} />
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => model.sqlSnippets.remove(index)}
                sx={{ position: 'absolute', top: 15, right: 5 }}
              >
                <Trash size={16} />
              </ActionIcon>
            </Stack>
          ))}
          <Group position="center" mt="xl" grow sx={{ width: '40%' }} mx="auto">
            <Button variant="default" onClick={addSnippet}>
              Add a snippet
            </Button>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
}
