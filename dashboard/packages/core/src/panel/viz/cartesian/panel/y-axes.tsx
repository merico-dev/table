import { ActionIcon, Anchor, Button, Group, JsonInput, Text, TextInput } from "@mantine/core";
import { FormList } from "@mantine/form/lib/form-list/form-list";
import { UseFormReturnType } from "@mantine/form/lib/use-form";
import { randomId } from "@mantine/hooks";
import { Trash } from "tabler-icons-react";
import { defaultNumbroFormat, NumbroFormatSelector } from "../../../settings/common/numbro-format-selector";
import { ICartesianChartSeriesItem, IYAxisConf } from "../type";

const numbroFormatExample = JSON.stringify({
  output: "percent",
  mantissa: 2
}, null, 2);

interface IYAxesField {
  form: UseFormReturnType<{
    x_axis_data_key: string;
    series: FormList<ICartesianChartSeriesItem>;
    x_axis_name: string;
    y_axes: FormList<IYAxisConf>;
  }>;
}
export function YAxesField({ form }: IYAxesField) {

  const addYAxis = () => form.addListItem('y_axes', {
    name: '',
    label_formatter: defaultNumbroFormat,
  });

  return (
    <Group direction="column" grow>
      <Text mt="xl" mb={0}>Y Axes</Text>
      {
        form.values.y_axes.map((_item, index) => (
          <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
            <Group direction="row" grow noWrap>
              <TextInput
                label="Name"
                required
                sx={{ flex: 1 }}
                {...form.getListInputProps('y_axes', index, 'name')}
              />
            </Group>
            <Group direction="column" grow noWrap>
              <NumbroFormatSelector
                label="Format"
                {...form.getListInputProps('y_axes', index, 'label_formatter')}
              />
            </Group>
            <ActionIcon
              color="red"
              variant="hover"
              onClick={() => form.removeListItem('y_axes', index)}
              sx={{ position: 'absolute', top: 15, right: 5 }}
              disabled={index === 0}
            >
              <Trash size={16} />
            </ActionIcon>
          </Group>

        ))
      }
      <Group position="center" mt="xs">
        <Button onClick={addYAxis}>
          Add a Y Axis
        </Button>
      </Group>
    </Group>
  )
}
