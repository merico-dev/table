import { ActionIcon, Button, Divider, Group, Switch, Text, TextInput } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { Prism } from "@mantine/prism";
import { DeviceFloppy, Trash } from "tabler-icons-react";
import { IVizPanelProps } from "../../../types/viz-panel";
import { MantineFontSizeSlider } from "../../settings/common/mantine-font-size";
import { IColumnConf, ValueType } from "./type";
import { ValueTypeSelector } from "./value-type-selector";

export function VizTablePanel({ conf: { columns, ...restConf }, setConf }: IVizPanelProps) {
  const form = useForm({
    initialValues: {
      id_field: 'id',
      use_raw_columns: true,
      columns: formList<IColumnConf>(columns ?? []),
      size: 'sm',
      horizontalSpacing: 'sm',
      verticalSpacing: 'sm',
      striped: false,
      highlightOnHover: false,
      ...restConf
    },
  });

  const addColumn = () => form.addListItem('columns', { label: randomId(), value_field: 'value', value_type: ValueType.string });

  return (
    <Group direction="column" mt="md" spacing="xs" grow>
      <form onSubmit={form.onSubmit(setConf)}>
        <Group position="apart" mb="lg" sx={{ position: 'relative' }}>
          <Text>Table Config</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Group direction="column" mt="md" spacing="xs" grow p="md" mb="sm" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
          <TextInput size="md" mb="lg" label="ID Field" {...form.getInputProps('id_field')} />
          <Group position="apart" mb="lg" grow sx={{ '> *': { flexGrow: 1 } }}>
            <MantineFontSizeSlider
              label="Horizontal Spacing"
              {...form.getInputProps('horizontalSpacing')}
            />
            <MantineFontSizeSlider
              label="Vertical Spacing"
              {...form.getInputProps('verticalSpacing')}
            />
          </Group>
          <Group position="apart" mb="lg" grow sx={{ '> *': { flexGrow: 1 } }}>
            <MantineFontSizeSlider
              label="Font Size"
              {...form.getInputProps('size')}
            />
          </Group>
          <Group direction="column" grow>
            <Text>Other</Text>
            <Group position="apart" grow>
              <Switch label="Striped" {...form.getInputProps('striped', { type: 'checkbox' })} />
              <Switch label="Highlight on hover" {...form.getInputProps('highlightOnHover', { type: 'checkbox' })} />
            </Group>
          </Group>
        </Group>
        <Group direction="column" mt="xs" spacing="xs" grow p="md" mb="xl" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
          <Switch label="Use Original Data Columns" {...form.getInputProps('use_raw_columns', { type: 'checkbox' })} />
          {!form.values.use_raw_columns && (
            <Group direction="column" grow>
              <Text mt="xl" mb={0}>Custom Columns</Text>
              {form.values.columns.map((item, index) => (
                <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
                  <Group position="apart" grow sx={{ '> *': { flexGrow: 1, maxWidth: '100%' } }}>
                    <TextInput
                      label="Label"
                      required
                      sx={{ flex: 1 }}
                      {...form.getListInputProps('columns', index, 'label')}
                    />
                    <TextInput
                      label="Value Field"
                      placeholder="get column value by this field"
                      required
                      sx={{ flex: 1 }}
                      {...form.getListInputProps('columns', index, 'value_field')}
                    />
                    <ValueTypeSelector
                      label="Value Type"
                      sx={{ flex: 1 }}
                      {...form.getListInputProps('columns', index, 'value_type')}
                    />
                  </Group>
                  <ActionIcon
                    color="red"
                    variant="hover"
                    onClick={() => form.removeListItem('columns', index)}
                    sx={{ position: 'absolute', top: 15, right: 5 }}
                  >
                    <Trash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Group position="center" mt="xs">
                <Button onClick={addColumn}>
                  Add a Column
                </Button>
              </Group>
            </Group>
          )}
        </Group>
        <Text weight={500} mb="md">
          Current Configuration:
        </Text>
        <Prism language="json" colorScheme="dark" noCopy>{JSON.stringify(form.values, null, 2)}</Prism>
      </form>
    </Group>
  )
}