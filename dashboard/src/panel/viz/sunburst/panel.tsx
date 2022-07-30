import { ActionIcon, Group, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DeviceFloppy } from "tabler-icons-react";
import { IVizPanelProps } from "../../../types/viz-panel";
import { DataFieldSelector } from "../../settings/common/data-field-selector";

export function SunburstPanel({ conf: { label_field, value_field }, setConf, data }: IVizPanelProps) {
  const form = useForm({
    initialValues: {
      label_field: label_field,
      value_field: value_field,
    },
  });

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={form.onSubmit(setConf)}>
        <Group position="apart" mb="lg" sx={{ position: 'relative' }}>
          <Text>Sunburst Config</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Stack mt="md" spacing="xs" p="md" mb="sm" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
          <DataFieldSelector label="Label Field" required data={data} {...form.getInputProps('label_field')} />
          <DataFieldSelector label="Value Field" required data={data} {...form.getInputProps('value_field')} />
        </Stack>
      </form>
    </Stack>
  )
}