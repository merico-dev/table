import { ActionIcon, Button, Group, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { SeriesField } from "./series";
import { ICartesianChartConf, ICartesianChartSeriesItem, IVizCartesianChartPanel, IYAxisConf } from "../type";
import { YAxesField } from "./y-axes";
import { defaultNumbroFormat } from "../../../settings/common/numbro-format-selector";

function withDefaults(series: ICartesianChartSeriesItem[]) {
  function setDefaults({
    type,
    name,
    showSymbol,
    y_axis_data_key = 'value',
    yAxisIndex = 0,
    label_position = 'top',
    stack = '1',
    color = 'black',
  }: ICartesianChartSeriesItem) {
    return { type, name, showSymbol, y_axis_data_key, yAxisIndex, label_position, stack, color }
  }

  return series.map(setDefaults);
}

export function VizCartesianChartPanel({ conf, setConf }: IVizCartesianChartPanel) {
  const { series, y_axes, ...restConf } = conf;
  const defaultValues = React.useMemo(() => {
    const { x_axis_name = '', ...rest } = restConf
    return {
      series: withDefaults(series ?? []),
      x_axis_name,
      y_axes: y_axes ?? [{
        name: 'Y Axis',
        label_formatter: defaultNumbroFormat,
      }],
      ...rest
    }
  }, [series, restConf]);

  const { control, handleSubmit, watch, formState: { isDirty }, getValues } = useForm<ICartesianChartConf>({ defaultValues });

  return (
    <Group direction="column" mt="md" spacing="xs" grow>
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="apart" mb="lg" sx={{ position: 'relative' }}>
          <Text>Chart Config</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!isDirty}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Controller
          name='x_axis_data_key'
          control={control}
          render={(({ field }) => <TextInput size="md" mb="lg" label="X Axis Data Key" {...field} />)}
        />
        <Group direction="column" grow noWrap mb="lg">
          <Controller
            name='x_axis_name'
            control={control}
            render={(({ field }) => <TextInput size="md" label="X Axis Name" {...field} />)}
          />
        </Group>
        <YAxesField control={control} watch={watch} />
        <SeriesField control={control} watch={watch} getValues={getValues} />
      </form>
    </Group>
  )
}