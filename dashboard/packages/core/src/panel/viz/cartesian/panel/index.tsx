import { ActionIcon, Button, Group, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { SeriesField } from "./series";
import { ICartesianChartConf, ICartesianChartSeriesItem, IVizCartesianChartPanel, IYAxisConf } from "../type";
import { YAxesField } from "./y-axes";
import { defaultNumbroFormat } from "../../../settings/common/numbro-format-selector";
import { DataFieldSelector } from "../../../settings/common/data-field-selector";

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
    barWidth = '30',
    smooth = false,
    step = false,
  }: ICartesianChartSeriesItem) {
    return { type, name, showSymbol, y_axis_data_key, yAxisIndex, label_position, stack, color, barWidth, smooth, step }
  }

  return series.map(setDefaults);
}

export function VizCartesianChartPanel({ conf, setConf, data }: IVizCartesianChartPanel) {
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

  React.useEffect(() => {
    const configMalformed = !_.isEqual(conf, defaultValues);
    if (configMalformed) {
      setConf(defaultValues)
    }
  }, [conf, defaultValues])

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
        <Group direction="column" grow noWrap mb="lg">
          <Controller
            name='x_axis_data_key'
            control={control}
            render={(({ field }) => (
              <DataFieldSelector label="X Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
            ))}
          />
          <Controller
            name='x_axis_name'
            control={control}
            render={(({ field }) => <TextInput label="X Axis Name" {...field} />)}
          />
        </Group>
        <YAxesField control={control} watch={watch} />
        <SeriesField control={control} watch={watch} getValues={getValues} data={data} />
      </form>
    </Group>
  )
}