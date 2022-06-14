import { Group, JsonInput, Text, TextInput } from "@mantine/core";
import { useForm, formList } from "@mantine/form";
import { Prism } from "@mantine/prism";
import { IVizPanelProps } from "../../../types/viz-panel";
import { MantineColorSelector } from "../../settings/common/mantine-color";
import { MantineFontWeightSlider } from "../../settings/common/mantine-font-weight";
import { IVizStatsConf } from "./types";

// {
//   align: "center",
//   size: "xl",
//   weight: "bold",
//   color: "black",
//   template: "Time: ${new Date().toISOString()}"
// },

export function VizStatsPanel({ conf: { size, color, weight, template, value_field }, setConf }: IVizPanelProps) {
  const form = useForm<IVizStatsConf>({
    initialValues: {
      size,
      color,
      template,
      weight,
      value_field,
    },
  });

  return (
    <Group direction="column" mt="md" spacing="xs" grow>
      <form onSubmit={form.onSubmit(setConf)}>
        <Group direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
          <TextInput
            placeholder="Read this field as value"
            label="Value Field"
            required
            sx={{ flex: 1 }}
            {...form.getInputProps('value_field')}
          />
          <TextInput
            placeholder="Time: ${new Date().toISOString()}"
            label="Content Template"
            required
            sx={{ flex: 1 }}
            {...form.getInputProps('template')}
          />
          <Group direction="column" grow>
            <JsonInput
              label="Color"
              {...form.getInputProps('color')}
            />
          </Group>
          <Group direction="column" grow>
            <TextInput
              label="Font Size"
              placeholder="10px, 1em, 1rem, 100%..."
              sx={{ flex: 1 }}
              {...form.getInputProps('size')}
            />
          </Group>
          <Group position="apart" grow sx={{ '> *': { flexGrow: 1, maxWidth: '100%' } }}>
            <MantineFontWeightSlider label="Font Weight" {...form.getInputProps('weight')} />
          </Group>
        </Group>

        <Text size="sm" weight={500} mt="md">
          Current Configuration:
        </Text>
        <Prism language="json" colorScheme="dark" noCopy>{JSON.stringify(form.values, null, 2)}</Prism>
      </form>
    </Group>
  )
}