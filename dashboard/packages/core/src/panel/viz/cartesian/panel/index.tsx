import { ActionIcon, Button, Group, Text, TextInput } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { SeriesField } from "./series";
import { ICartesianChartSeriesItem, IVizCartesianChartPanel, IYAxisConf } from "../type";
import { YAxesField } from "./y-axes";

function withDefaults(series: ICartesianChartSeriesItem[]) {
  function setDefaults({
    type,
    name,
    showSymbol,
    y_axis_data_key = 'value',
    y_axis_id = '',
    label_position = 'top',
    stack = '1',
    color = 'black',
  }: ICartesianChartSeriesItem) {
    return { type, name, showSymbol, y_axis_data_key, y_axis_id, label_position, stack, color }
  }

  return series.map(setDefaults);
}

export function VizCartesianChartPanel({ conf, setConf }: IVizCartesianChartPanel) {
  const { series, y_axes, ...restConf } = conf;
  const initialValues = React.useMemo(() => {
    const { x_axis_name = '', ...rest } = restConf
    return {
      series: formList<ICartesianChartSeriesItem>(withDefaults(series ?? [])),
      x_axis_name,
      y_axes: formList<IYAxisConf>(y_axes ?? []),
      ...rest
    }
  }, [series, restConf]);

  const form = useForm({
    initialValues,
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
        </Group>
        <YAxesField form={form} />
        <SeriesField form={form} />
      </form>
    </Group>
  )
}