import { Accordion, ActionIcon, Group, Stack, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { SeriesField } from "./series";
import { ICartesianChartConf, ICartesianChartSeriesItem, IVizCartesianChartPanel, IYAxisConf } from "../type";
import { YAxesField } from "./y-axes";
import { defaultNumbroFormat } from "../../../settings/common/numbro-format-selector";
import { DataFieldSelector } from "../../../settings/common/data-field-selector";
import { RegressionsField } from "./regressions";
import { StatsField } from "./stats";

function withDefaults(series: ICartesianChartSeriesItem[]) {
  function setDefaults({
    type,
    name,
    showSymbol,
    symbolSize = 5,
    y_axis_data_key = 'value',
    yAxisIndex = 0,
    label_position = 'top',
    stack = '1',
    color = 'black',
    barWidth = '30',
    smooth = false,
    step = false,
  }: ICartesianChartSeriesItem) {
    return { type, name, showSymbol, symbolSize, y_axis_data_key, yAxisIndex, label_position, stack, color, barWidth, smooth, step }
  }

  return series.map(setDefaults);
}

function normalizeStats(stats?: ICartesianChartConf['stats']) {
  if (!stats) {
    return {
      templates: {
        top: '',
        bottom: '',
      },
      variables: [],
    }
  }
  return stats;
}

export function VizCartesianChartPanel({ conf, setConf, data }: IVizCartesianChartPanel) {
  const { series, y_axes, ...restConf } = conf;
  const defaultValues = React.useMemo(() => {
    const { x_axis_name = '', stats, ...rest } = restConf
    return {
      series: withDefaults(series ?? []),
      x_axis_name,
      y_axes: y_axes ?? [{
        name: 'Y Axis',
        label_formatter: defaultNumbroFormat,
      }],
      stats: normalizeStats(stats),
      ...rest
    }
  }, [series, restConf]);

  React.useEffect(() => {
    const configMalformed = !_.isEqual(conf, defaultValues);
    if (configMalformed) {
      setConf(defaultValues)
    }
  }, [conf, defaultValues])

  const { control, handleSubmit, watch, getValues } = useForm<ICartesianChartConf>({ defaultValues });

  watch(['x_axis_data_key', 'x_axis_name'])
  const values = getValues()
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf)
  }, [values, conf])

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Chart Config</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Accordion multiple value={["X Axis", "Y Axes"]}>
          <Accordion.Item value="X Axis">
            <Group grow noWrap>
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
                render={(({ field }) => <TextInput label="X Axis Name" sx={{ flex: 1 }} {...field} />)}
              />
            </Group>
          </Accordion.Item>
          <Accordion.Item value="Y Axes">
            <YAxesField control={control} watch={watch} />
          </Accordion.Item>
          <Accordion.Item value="Series">
            <SeriesField control={control} watch={watch} getValues={getValues} data={data} />
          </Accordion.Item>
          <Accordion.Item value="Regression Lines">
            <RegressionsField control={control} watch={watch} getValues={getValues} data={data} />
          </Accordion.Item>
          <Accordion.Item value="Stats">
            <StatsField control={control} watch={watch} data={data} />
          </Accordion.Item>
        </Accordion>
      </form>
    </Stack>
  )
}