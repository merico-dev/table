import { ActionIcon, Group, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { IDataSource } from "../../types";

interface IDataSourceForm {
  value: IDataSource;
  onChange: any;
}
export function DataSourceForm({ value, onChange }: IDataSourceForm) {
  const form = useForm({
    initialValues: value,
  });

  const submit = React.useCallback((values: IDataSource) => {
    onChange(values);
  }, [onChange]);

  const changed = React.useMemo(() => {
    return !_.isEqual(value, form.values)
  }, [value, form.values])

  React.useEffect(() => {
    form.reset()
  }, [value])

  return (
    <Group direction="column" grow sx={{ border: '1px solid #eee' }}>
      <form onSubmit={form.onSubmit(submit)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text weight={500}>Data Source Configuration</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Group direction="column" grow my={0} p="md" pr={40}>
          <Group grow>
            <TextInput
              placeholder="An ID unique in this dashboard"
              label="ID"
              required
              sx={{ flex: 1 }}
              {...form.getInputProps('id')}
            />
            <TextInput
              placeholder="TODO: use a dedicated UI component for this"
              label="Data Source Key"
              required
              sx={{ flex: 1 }}
              {...form.getInputProps('key')}
            />
            <TextInput
              placeholder="Type of the data source"
              label="Type"
              disabled
              sx={{ flex: 1 }}
              {...form.getInputProps('type')}
            />
          </Group>
          <Textarea
            minRows={8}
            maxRows={12}
            {...form.getInputProps('sql')}
          />
        </Group>

        {/* <Text size="sm" weight={500} mt="md">
          Current Configuration:
        </Text>
        <Prism language="json" colorScheme="dark" noCopy>{JSON.stringify(form.values, null, 2)}</Prism> */}
      </form>
    </Group>
  )
}