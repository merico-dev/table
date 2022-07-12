import { Button, Group, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import React from "react";
import { Control, useFieldArray, UseFormGetValues, UseFormWatch } from "react-hook-form";
import { IVizStatsConf } from "../types";
import { VariableField } from "./variable";

interface IVariablesField {
  control: Control<IVizStatsConf, any>;
  watch: UseFormWatch<IVizStatsConf>;
  data: any[];
}
export function VariablesField({ control, watch, data }: IVariablesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variables"
  });

  const watchFieldArray = watch("variables");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  const add = () => append({
    name: randomId(),
    size: '20px',
    weight: 'bold',
    color: {
      type: 'static',
      staticColor: 'blue',
    },
    data_field: '',
    formatter: {
      output: 'number',
      mantissa: 0,
    },
  });

  return (
    <Group direction="column" grow>
      {controlledFields.map((variableItem, index) => (
        <VariableField
          variableItem={variableItem}
          control={control}
          index={index}
          remove={remove}
          data={data}
        />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>
          Add a Variable
        </Button>
      </Group>
    </Group>
  )
}
