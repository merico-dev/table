import { ActionIcon, Button, Group, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import _ from 'lodash';
import React from 'react';
import { DeviceFloppy, Trash } from 'tabler-icons-react';
import { DashboardModelInstance } from '../../model';
import { PreviewSnippet } from './preview-snippet';

interface ISQLSnippetsEditor {
  model: DashboardModelInstance;
}

export function SQLSnippetsEditor({ model }: ISQLSnippetsEditor) {
  const initialValues = React.useMemo(
    () => ({
      snippets: model.sqlSnippets.current,
    }),
    [model.sqlSnippets.current],
  );

  const form = useForm({
    initialValues,
  });

  const addSnippet = () =>
    form.insertListItem('snippets', {
      key: randomId(),
      value: '',
    });

  const changed = React.useMemo(() => !_.isEqual(form.values, initialValues), [form.values, initialValues]);

  const submit = ({ snippets }: typeof form.values) => {
    // setSQLSnippets(snippets);
  };
  return (
    <Stack sx={{ border: '1px solid #eee', flexGrow: 1 }}>
      <form onSubmit={form.onSubmit(submit)}>
        <Group
          position="left"
          pl="md"
          py="md"
          sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}
        >
          <Text weight={500}>SQL Snippets</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Group px="md" pb="md" pt="md">
          <Stack sx={{ width: '100%', position: 'relative' }}>
            {form.values.snippets.map((_item, index) => (
              <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
                <TextInput label="Key" required {...form.getInputProps(`snippets.${index}.key`)} />
                <Textarea
                  minRows={3}
                  label="Value"
                  required
                  {...form.getInputProps(`snippets.${index}.value`)}
                  className="code-textarea"
                />
                <PreviewSnippet value={form.values.snippets[index].value} />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => form.removeListItem('snippets', index)}
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
      </form>
    </Stack>
  );
}
