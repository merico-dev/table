import { Group, TextInput } from "@mantine/core";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { ICartesianChartConf } from "../../type";

interface IBarFields {
  control: Control<ICartesianChartConf, any>;
  index: number;
}

export function BarFields({
  control,
  index,
}: IBarFields) {
  return (
    <Group direction="row" grow align="top">
      <Controller
        name={`series.${index}.stack`}
        control={control}
        render={(({ field }) => (
          <TextInput
            label="Stack"
            placeholder="Stack bars by this ID"
            sx={{ flexGrow: 1 }}
            {...field}
          />
        ))}
      />
      <Controller
        name={`series.${index}.barWidth`}
        control={control}
        render={(({ field }) => (
          <TextInput
            label="Bar Width"
            sx={{ flexGrow: 1 }}
            {...field}
          />
        ))}
      />
    </Group>
  )
}