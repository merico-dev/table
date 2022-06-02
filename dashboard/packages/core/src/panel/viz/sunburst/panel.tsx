import { ActionIcon, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DeviceFloppy } from "tabler-icons-react";
import { IVizPanelProps } from "../../../types/viz-panel";

export function SunburstPanel({ conf: { label_field, value_field }, setConf }: IVizPanelProps) {
  const form = useForm({
    initialValues: {
      label_field: label_field,
      value_field: value_field,
    },
  });

  return (
    <Group direction="column" mt="md" spacing="xs" grow>
      <form onSubmit={form.onSubmit(setConf)}>
        <Group position="apart" mb="lg" sx={{ position: 'relative' }}>
          <Text>Sunburst Config</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Group direction="column" mt="md" spacing="xs" grow p="md" mb="sm" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
          <TextInput
            label="Label Field"
            required
            sx={{ flex: 1 }}
            {...form.getInputProps('label_field')}
          />
          <TextInput
            label="Value Field"
            placeholder="get column value by this field"
            required
            sx={{ flex: 1 }}
            {...form.getInputProps('value_field')}
          />
        </Group>
      </form>
    </Group>
  )
}