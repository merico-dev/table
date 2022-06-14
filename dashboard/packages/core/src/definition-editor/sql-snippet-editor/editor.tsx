import { ActionIcon, Button, Group, Text, Textarea, TextInput } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { Prism } from "@mantine/prism";
import _ from "lodash";
import React from "react";
import { DeviceFloppy, Trash } from "tabler-icons-react";
import { DefinitionContext } from "../../contexts";
import { ISQLSnippet } from "../../types";

interface ISQLSnippetsEditor {
}

export function SQLSnippetsEditor({ }: ISQLSnippetsEditor) {
  const { sqlSnippets, setSQLSnippets } = React.useContext(DefinitionContext)
  const sampleSQL = `SELECT *\nFROM commit\nWHERE \$\{author_time_condition\}`;

  const initialValues = React.useMemo(() => ({
    snippets: formList<ISQLSnippet>(sqlSnippets ?? []),
  }), [sqlSnippets]);

  const form = useForm({
    initialValues,
  });

  const addSnippet = () => form.addListItem('snippets', {
    key: randomId(),
    value: '',
  });

  const changed = React.useMemo(() => !_.isEqual(form.values, initialValues), [form.values, initialValues])

  const submit = ({ snippets }: typeof form.values) => {
    setSQLSnippets(snippets);
  }
  return (
    <Group direction="column" grow sx={{ border: '1px solid #eee' }}>
      <form onSubmit={form.onSubmit(submit)}>
        <Group position="left" pl="md" py="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}>
          <Text weight={500}>SQL Snippets</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Group px="md" pb="md">
          <Prism language="sql" sx={{ width: '100%' }} noCopy trim={false} colorScheme="dark">
            {`-- You may refer context data *by name*\n-- in SQL or VizConfig.\n\n${sampleSQL}\n\n-- where author_time_condition is:\nauthor_time BETWEEN '\$\{timeRange?.[0].toISOString()\}' AND '\$\{timeRange?.[1].toISOString()\}'\n `}
          </Prism>
          <Group direction="column" sx={{ width: '100%', position: 'relative' }} grow>
            {form.values.snippets.map((_item, index) => (
              <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
                <TextInput
                  label="Key"
                  required
                  {...form.getListInputProps('snippets', index, 'key')}
                />
                <Textarea
                  minRows={3}
                  label="Value"
                  required
                  {...form.getListInputProps('snippets', index, 'value')}
                />
                <ActionIcon
                  color="red" variant="hover"
                  onClick={() => form.removeListItem('snippets', index)}
                  sx={{ position: 'absolute', top: 15, right: 5 }}
                >
                  <Trash size={16} />
                </ActionIcon>
              </Group>
            ))}
            <Group position="center" mt="xl" grow sx={{ width: '40%' }} mx="auto">
              <Button variant="default" onClick={addSnippet}>
                Add a snippet
              </Button>
            </Group>
          </Group>
        </Group>
      </form>
    </Group>
  )
}