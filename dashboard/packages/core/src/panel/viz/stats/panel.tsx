import { ActionIcon, Group, JsonInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Prism } from "@mantine/prism";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { IVizPanelProps } from "../../../types/viz-panel";
import { MantineFontWeightSlider } from "../../settings/common/mantine-font-weight";
import { IVizStatsConf } from "./types";

export function VizStatsPanel({ conf, setConf }: IVizPanelProps) {
  const { size, color, weight, template, value_field } = conf;

  const form = useForm<IVizStatsConf>({
    initialValues: {
      align: 'center',
      size,
      color,
      template,
      weight,
      value_field,
    },
  });

  const changed = React.useMemo(() => {
    return !_.isEqual(conf, form.values);
  }, [conf, form.values])

  return (
    <Group direction="column" mt="md" spacing="xs" grow noWrap>
      <form onSubmit={form.onSubmit(setConf)}>
      <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text weight={500}>Stats Configurations</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
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