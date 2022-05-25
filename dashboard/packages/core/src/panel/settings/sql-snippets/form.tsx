import { ActionIcon, Button, Group, Text, Textarea, TextInput } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import _ from "lodash";
import React from "react";
import { Trash } from "tabler-icons-react";
import { IDefinitionContext } from "../../../contexts";
import { ISQLSnippet } from "../../../types";

interface ISQLSnippetsForm {
  sqlSnippets: ISQLSnippet[];
  setSQLSnippets: IDefinitionContext['setSQLSnippets'];
}
export function SQLSnippetsForm({
  sqlSnippets,
  setSQLSnippets,
}: ISQLSnippetsForm) {
  const submitButton = React.useRef<HTMLButtonElement>(null)

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

  React.useEffect(() => {
    if (changed) {
      submitButton?.current?.click()
    }
  }, [changed, submitButton.current])

  const submit = ({ snippets }: typeof form.values) => {
    setSQLSnippets(snippets);
  }

  return (
    <Group direction="column" sx={{ width: '100%' }} grow>
      <form onSubmit={form.onSubmit(submit)}>
        <button ref={submitButton} type='submit' style={{ display: 'none' }}>Ghost submit</button>
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
              color="red"
              variant="hover"
              onClick={() => form.removeListItem('snippets', index)}
              sx={{ position: 'absolute', top: 15, right: 5 }}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>
        ))}
        <Group position="center" mt="xl" grow sx={{ width: '60%' }} mx="auto">
          <Button color="blue" onClick={addSnippet}>
            Add a snippet
          </Button>
        </Group>
      </form>
    </Group>
  )
}