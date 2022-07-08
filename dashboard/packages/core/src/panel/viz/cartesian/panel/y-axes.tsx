import { ActionIcon, Button, Group, Text, TextInput } from "@mantine/core";
import { Control, Controller, useFieldArray, UseFieldArrayRemove, UseFormRegister, UseFormWatch, useWatch } from "react-hook-form";
import { Trash } from "tabler-icons-react";
import { defaultNumbroFormat, NumbroFormatSelector } from "../../../settings/common/numbro-format-selector";
import { ICartesianChartConf } from "../type";


interface IYAxisField {
  control: Control<ICartesianChartConf, any>;
  index: number;
  remove: UseFieldArrayRemove;
}

function YAxisField({ control, index, remove }: IYAxisField) {
  return (
    <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group direction="row" grow noWrap>
        <Controller
          name={`y_axes.${index}.name`}
          control={control}
          render={(({ field }) => (
            <TextInput
              label="Name"
              required
              sx={{ flex: 1 }}
              {...field} />
          ))}
        />
      </Group>
      <Group direction="column" grow noWrap>
        <Controller
          name={`y_axes.${index}.label_formatter`}
          control={control}
          render={(({ field }) => <NumbroFormatSelector {...field} />)}
        />
      </Group>
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
        disabled={index === 0}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group>

  )
}

interface IYAxesField {
  control: Control<ICartesianChartConf, any>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function YAxesField({ control, watch }: IYAxesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "y_axes"
  });

  const watchFieldArray = watch("y_axes");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  const addYAxis = () => append({
    name: '',
    label_formatter: defaultNumbroFormat,
  });

  return (
    <Group direction="column" grow>
      {controlledFields.map((field, index) => <YAxisField control={control} index={index} remove={remove} />)}
      <Group position="center" mt="xs">
        <Button onClick={addYAxis}>
          Add a Y Axis
        </Button>
      </Group>
    </Group>
  )
}
