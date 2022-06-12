import { ActionIcon, Anchor, Button, Group, JsonInput, Select, Text, Textarea, TextInput } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import _ from "lodash";
import React from "react";
import { DeviceFloppy, Stack, Trash } from "tabler-icons-react";
import { MantineColorSelector } from "../../settings/common/mantine-color";
import { ILineBarChartSeriesItem, IVizLineBarChartPanel } from "./type";

const numbroFormatExample = JSON.stringify({
  output: "percent",
  mantissa: 2
}, null, 2);

const labelPositions = [
  { label: 'top', value: 'top', },
  { label: 'left', value: 'left', },
  { label: 'right', value: 'right', },
  { label: 'bottom', value: 'bottom', },
  { label: 'inside', value: 'inside', },
  { label: 'insideLeft', value: 'insideLeft', },
  { label: 'insideRight', value: 'insideRight', },
  { label: 'insideTop', value: 'insideTop', },
  { label: 'insideBottom', value: 'insideBottom', },
  { label: 'insideTopLeft', value: 'insideTopLeft', },
  { label: 'insideBottomLeft', value: 'insideBottomLeft', },
  { label: 'insideTopRight', value: 'insideTopRight', },
  { label: 'insideBottomRight', value: 'insideBottomRight', },
]

function withDefaults(series: ILineBarChartSeriesItem[]) {
  function setDefaults({
    type,
    name,
    showSymbol,
    y_axis_data_key = 'value',
    y_axis_data_formatter = '',
    label_position = 'top',
    stack = '1',
    color = 'black',
  }: ILineBarChartSeriesItem) {
    return { type, name, showSymbol, y_axis_data_key, y_axis_data_formatter, label_position, stack, color }
  }

  return series.map(setDefaults);
}

export function VizLineBarChartPanel({ conf, setConf }: IVizLineBarChartPanel) {
  const { series, ...restConf } = conf;
  const initialValues = React.useMemo(() => ({
    series: formList<ILineBarChartSeriesItem>(withDefaults(series ?? [])),
    ...restConf
  }), [series, restConf]);

  const form = useForm({
    initialValues,
  });

  const addSeries = () => form.addListItem('series', {
    type: 'bar',
    name: randomId(),
    showSymbol: false,
    y_axis_data_key: 'value',
    y_axis_data_formatter: '',
    label_position: 'top',
    stack: '',
    color: '#000'
  });

  const changed = React.useMemo(() => !_.isEqual(form.values, initialValues), [form.values, initialValues])

  return (
    <Group direction="column" mt="md" spacing="xs" grow>
      <form onSubmit={form.onSubmit(setConf)}>
        <Group position="apart" mb="lg" sx={{ position: 'relative' }}>
          <Text>Chart Config</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <TextInput size="md" mb="lg" label="X Axis Data Key" {...form.getInputProps('x_axis_data_key')} />
        <Group direction="column" grow>
          <Text mt="xl" mb={0}>Series</Text>
          {form.values.series.map((item, index) => (
            <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
              <Group direction="row" grow noWrap>
                <TextInput
                  label="Name"
                  required
                  sx={{ flex: 1 }}
                  {...form.getListInputProps('series', index, 'name')}
                />
                <TextInput
                  label="Stack"
                  placeholder="Stack bars by this ID"
                  {...form.getListInputProps('series', index, 'stack')}
                />
                <TextInput
                  label="Value key"
                  required
                  {...form.getListInputProps('series', index, 'y_axis_data_key')}
                />
              </Group>
              <Group direction="row" grow noWrap align="top">
                <Select
                  label="Label Position"
                  data={labelPositions}
                  {...form.getListInputProps('series', index, 'label_position')}
                />
                <JsonInput
                  sx={{ label: { width: '100%' } }}
                  label={(
                    <Group position="apart">
                      <Text>Value Formatter</Text>
                      <Anchor href="https://numbrojs.com/format.html" target="_blank">
                        Formats
                      </Anchor>
                    </Group>
                  )}
                  placeholder={numbroFormatExample}
                  minRows={4}
                  maxRows={12}
                  autosize
                  {...form.getListInputProps('series', index, 'y_axis_data_formatter')}
                />
              </Group>
              <Group direction="column" grow>
                <Text>Color</Text>
                <MantineColorSelector {...form.getListInputProps('series', index, 'color')} />
              </Group>
              <ActionIcon
                color="red"
                variant="hover"
                onClick={() => form.removeListItem('series', index)}
                sx={{ position: 'absolute', top: 15, right: 5 }}
              >
                <Trash size={16} />
              </ActionIcon>
            </Group>
          ))}
          <Group position="center" mt="xs">
            <Button onClick={addSeries}>
              Add a Series
            </Button>
          </Group>
        </Group>
      </form>
    </Group>
  )
}