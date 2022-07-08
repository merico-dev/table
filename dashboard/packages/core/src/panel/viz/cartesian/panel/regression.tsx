import { ActionIcon, Button, Group, NumberInput, Select, Text, TextInput } from "@mantine/core";
import React from "react";
import { Control, Controller, useFieldArray, UseFieldArrayRemove, UseFormGetValues, UseFormRegister, UseFormWatch, useWatch } from "react-hook-form";
import { Trash } from "tabler-icons-react";
import { DataFieldSelector } from "../../../settings/common/data-field-selector";
import { MantineColorSelector } from "../../../settings/common/mantine-color";
import { defaultNumbroFormat, NumbroFormatSelector } from "../../../settings/common/numbro-format-selector";
import { ICartesianChartConf, IRegressionConf } from "../type";

const regressionOptions = [
  { label: 'Linear', value: 'linear', },
  { label: 'Exponential', value: 'exponential', },
  { label: 'Logarithmic', value: 'logarithmic', },
  { label: 'Polynomial', value: 'polynomial', },
]

interface IRegressionField {
  control: Control<ICartesianChartConf, any>;
  regressionItem: IRegressionConf;
  index: number;
  remove: UseFieldArrayRemove;
  yAxisOptions: {
    label: string;
    value: string;
  }[];
  data: any[];
}

function RegressionField({ control, regressionItem, index, remove, yAxisOptions, data }: IRegressionField) {
  const method = regressionItem.transform.config.method;
  return (
    <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Controller
        name={`regressions.${index}.name`}
        control={control}
        render={(({ field }) => (
          <TextInput
            label="Name"
            required
            sx={{ flex: 1 }}
            {...field} />
        ))}
      />
      <Group direction="row" grow noWrap>
        <Controller
          name={`regressions.${index}.y_axis_data_key`}
          control={control}
          render={(({ field }) => (
            <DataFieldSelector label="Value Field" required data={data} sx={{ flex: 1 }} {...field} />
          ))}
        />
        <Controller
          name={`regressions.${index}.plot.yAxisIndex`}
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
      <Group direction="row" grow noWrap>
        <Controller
          name={`regressions.${index}.transform.config.method`}
          control={control}
          render={(({ field }) => (
            <Select
              label="Method"
              data={regressionOptions}
              sx={{ flex: 1 }}
              {...field} />
          ))}
        />
        {method === 'polynomial' && (
          <Controller
            name={`regressions.${index}.transform.config.order`}
            control={control}
            render={(({ field }) => <NumberInput label="Order" sx={{ flex: 1 }} {...field} />)}
          />
        )}
      </Group>
      <Group direction="column" grow spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`regressions.${index}.plot.color`}
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

interface IRegressionsField {
  control: Control<ICartesianChartConf, any>;
  watch: UseFormWatch<ICartesianChartConf>;
  getValues: UseFormGetValues<ICartesianChartConf>;
  data: any[];
}
export function RegressionsField({ control, watch, getValues, data }: IRegressionsField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "regressions"
  });

  const watchFieldArray = watch("regressions");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  const yAxisOptions = React.useMemo(() => {
    return getValues().y_axes.map(({ name }, index) => ({
      label: name,
      value: index.toString()
    }))
  }, [getValues]);

  const add = () => append({
    transform: {
      type: 'ecStat:regression',
      config: {
        method: 'linear',
        order: 1,
        formulaOn: 'end',
      },
    },
    name: '',
    y_axis_data_key: '',
    plot: {
      type: 'line',
      yAxisIndex: 0,
      color: '#666666'
    }
  });

  return (
    <Group direction="column" grow>
      <Text mt="xl" mb={0}>Regression Lines</Text>
      {controlledFields.map((regressionItem, index) => (
        <RegressionField
          regressionItem={regressionItem}
          control={control}
          index={index}
          remove={remove}
          yAxisOptions={yAxisOptions}
          data={data}
        />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>
          Add a Regression Line
        </Button>
      </Group>
    </Group>
  )
}
