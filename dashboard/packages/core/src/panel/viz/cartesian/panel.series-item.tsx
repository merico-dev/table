import { ActionIcon, Anchor, Group, JsonInput, Select, Text, TextInput } from "@mantine/core";
import { FormList } from "@mantine/form/lib/form-list/form-list";
import { UseFormReturnType } from "@mantine/form/lib/use-form";
import { Trash } from "tabler-icons-react";
import { MantineColorSelector } from "../../settings/common/mantine-color";
import { ICartesianChartSeriesItem } from "./type";

const numbroFormatExample = JSON.stringify({
  output: "percent",
  mantissa: 2
}, null, 2);

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
  form: UseFormReturnType<{
    x_axis_data_key: string;
    series: FormList<ICartesianChartSeriesItem>;
    x_axis_name: string;
    y_axis_name: string;
  }>;
  index: number;
}
export function SeriesItemField({ form, index }: ISeriesItemField) {
  const value = form.values.series[index];
  const { type } = value;
  return (
    <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group direction="row" grow noWrap>
        <Select
          label="Type"
          data={[
            { label: 'Line', value: 'line' },
            { label: 'Bar', value: 'bar' },
            { label: 'Scatter', value: 'scatter', disabled: true },
          ]}
          {...form.getListInputProps('series', index, 'type')}
        />
        <TextInput
          label="Name"
          required
          sx={{ flex: 1 }}
          {...form.getListInputProps('series', index, 'name')}
        />
        <TextInput
          label="Value key"
          required
          {...form.getListInputProps('series', index, 'y_axis_data_key')}
        />
      </Group>
      <Group direction="row" grow noWrap align="top">
        {type === 'bar' && (
          <>
            <TextInput
              label="Stack"
              placeholder="Stack bars by this ID"
              {...form.getListInputProps('series', index, 'stack')}
            />
          </>
        )}
        <Select
          label="Label Position"
          data={labelPositions}
          {...form.getListInputProps('series', index, 'label_position')}
        />
        <JsonInput
          sx={{ label: { width: '100%' } }}
          label={(
            <Group position="apart">
              <Text>Value Formatter</Text>
              <Anchor href="https://numbrojs.com/format.html" target="_blank">
                Formats
              </Anchor>
            </Group>
          )}
          placeholder={numbroFormatExample}
          minRows={4}
          maxRows={12}
          autosize
          {...form.getListInputProps('series', index, 'y_axis_data_formatter')}
        />
      </Group>
      <Group direction="column" grow>
        <Text>Color</Text>
        <MantineColorSelector {...form.getListInputProps('series', index, 'color')} />
      </Group>
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => form.removeListItem('series', index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group>
  )
}
