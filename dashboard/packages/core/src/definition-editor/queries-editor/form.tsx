import { ActionIcon, Group, Select, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRequest } from "ahooks";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { getQuerySources } from "../../api-caller";
import { IQuery } from "../../types";

interface IQueryForm {
  value: IQuery;
  onChange: any;
}
export function QueryForm({ value, onChange }: IQueryForm) {
  const form = useForm({
    initialValues: value,
  });

  const submit = React.useCallback((values: IQuery) => {
    onChange(values);
  }, [onChange]);

  const changed = React.useMemo(() => {
    return !_.isEqual(value, form.values)
  }, [value, form.values])

  React.useEffect(() => {
    form.reset()
  }, [value])

  const { data: querySources = {}, loading } = useRequest(getQuerySources, {
    refreshDeps: []
  }, []);

  const querySourceTypeOptions = React.useMemo(() => {
    return Object.keys(querySources).map(k => ({
      label: k,
      value: k,
    }))
  }, [querySources]);

  const querySourceKeyOptions = React.useMemo(() => {
    const sources = querySources[form.values.type];
    if (!sources) {
      return [];
    }
    return sources.map(k => ({
      label: k,
      value: k,
    }))
  }, [querySources, form.values.type]);

  return (
    <Group direction="column" grow sx={{ border: '1px solid #eee', flexGrow: 1 }}>
      <form onSubmit={form.onSubmit(submit)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text weight={500}>Data Source Configuration</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!changed || loading}>
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
              disabled={loading}
              {...form.getInputProps('id')}
            />
            <Select
              label="Data Source Type"
              data={querySourceTypeOptions}
              sx={{ flex: 1 }}
              disabled={loading}
              {...form.getInputProps('type')}
            />
            <Select
              label="Data Source Key"
              data={querySourceKeyOptions}
              sx={{ flex: 1 }}
              disabled={loading}
              {...form.getInputProps('key')}
            />
          </Group>
          <Textarea
            autosize
            minRows={12}
            maxRows={24}
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