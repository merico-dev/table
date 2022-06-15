import { ActionIcon, Button, Group, Text, TextInput } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { SeriesItemField } from "./panel.series-item";
import { ILineBarChartSeriesItem, IVizLineBarChartPanel } from "./type";

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
  const initialValues = React.useMemo(() => {
    const { x_axis_name = '', y_axis_name = '', ...rest } = restConf
    return {
      series: formList<ILineBarChartSeriesItem>(withDefaults(series ?? [])),
      x_axis_name,
      y_axis_name,
      ...rest
    }
  }, [series, restConf]);

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
        <Group direction="column" grow noWrap mb="lg">
          <TextInput size="md" label="X Axis Name" {...form.getInputProps('x_axis_name')} />
          <TextInput size="md" label="Y Axis Name" {...form.getInputProps('y_axis_name')} />
        </Group>
        <Group direction="column" grow>
          <Text mt="xl" mb={0}>Series</Text>
          {form.values.series.map((_item, index) => <SeriesItemField form={form} index={index} />)}
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