import { Button, Group, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import React from "react";
import { Control, useFieldArray, UseFormGetValues, UseFormWatch } from "react-hook-form";
import { ICartesianChartConf } from "../../type";
import { SeriesItemField } from "./series-item";

interface ISeriesField {
  control: Control<ICartesianChartConf, any>;
  watch: UseFormWatch<ICartesianChartConf>;
  getValues: UseFormGetValues<ICartesianChartConf>;
  data: any[];
}
export function SeriesField({ control, watch, getValues, data }: ISeriesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "series"
  });

  const watchFieldArray = watch("series");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  const addSeries = () => append({
    type: 'bar',
    name: randomId(),
    showSymbol: false,
    symbolSize: 5,
    y_axis_data_key: 'value',
    yAxisIndex: 0,
    label_position: 'top',
    stack: '',
    color: '#000',
    step: false,
    smooth: false,
  });

  const yAxisOptions = React.useMemo(() => {
    return getValues().y_axes.map(({ name }, index) => ({
      label: name,
      value: index.toString()
    }))
  }, [getValues]);

  return (
    <Group direction="column" grow>
      {controlledFields.map((seriesItem, index) => (
        <SeriesItemField
          control={control}
          index={index}
          remove={remove}
          seriesItem={seriesItem}
          yAxisOptions={yAxisOptions}
          data={data}
        />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={addSeries}>
          Add a Series
        </Button>
      </Group>
    </Group>
  )
}
