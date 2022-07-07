import { ActionIcon, Group, SegmentedControl, Select, Text, TextInput } from "@mantine/core";
import React from "react";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { Trash } from "tabler-icons-react";
import { DataFieldSelector } from "../../../../settings/common/data-field-selector";
import { MantineColorSelector } from "../../../../settings/common/mantine-color";
import { ICartesianChartConf, ICartesianChartSeriesItem } from "../../type";
import { BarFields } from "./fields.bar";

const labelPositions = [
  { label: 'off', value: '', },
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


interface ISeriesItemField {
  control: Control<ICartesianChartConf, any>;
  index: number;
  remove: UseFieldArrayRemove;
  seriesItem: ICartesianChartSeriesItem;
  yAxisOptions: {
    label: string;
    value: string;
  }[];
  data: any[];
}

export function SeriesItemField({ control, index, remove, seriesItem, yAxisOptions, data }: ISeriesItemField) {
  const type = seriesItem.type;
  return (
    <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group direction="column" grow noWrap>
        <Controller
          name={`series.${index}.type`}
          control={control}
          render={(({ field }) => (
            <SegmentedControl
              data={[
                { label: 'Line', value: 'line' },
                { label: 'Bar', value: 'bar' },
                { label: 'Scatter', value: 'scatter', disabled: true },
                { label: 'Boxplot', value: 'boxplot', disabled: true },
              ]}
              {...field}
            />
          ))}
        />
      </Group>
      <Controller
        name={`series.${index}.name`}
        control={control}
        render={(({ field }) => (
          <TextInput
            label="Name"
            required
            sx={{ flex: 1 }}
            {...field}
          />
        ))}
      />
      <Group direction="row" grow noWrap>
        <Controller
          name={`series.${index}.y_axis_data_key`}
          control={control}
          render={(({ field }) => (
            <DataFieldSelector label="Value Field" required data={data} sx={{ flex: 1 }} {...field} />
          ))}
        />
        <Controller
          name={`series.${index}.yAxisIndex`}
          control={control}
          render={(({ field: { value, onChange, ...rest } }) => (
            <Select
              label="Y Axis"
              data={yAxisOptions}
              disabled={yAxisOptions.length === 0}
              {...rest}
              value={value?.toString() ?? ''}
              onChange={(value: string | null) => {
                if (!value) {
                  onChange(0);
                  return;
                }
                onChange(Number(value))
              }}
              sx={{ flex: 1 }}
            />

          ))}
        />
      </Group>

      {type === 'bar' && <BarFields index={index} control={control} />}

      <Controller
        name={`series.${index}.label_position`}
        control={control}
        render={(({ field }) => (
          <Select
            label="Label Position"
            data={labelPositions}
            {...field}
          />
        ))}
      />
      <Group direction="column" grow spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`series.${index}.color`}
          control={control}
          render={(({ field }) => (
            <MantineColorSelector {...field} />
          ))}
        />
      </Group>
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group>
  )
}