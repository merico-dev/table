import { ActionIcon, Button, Group, Text, TextInput } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import _ from "lodash";
import React from "react";
import { Trash } from "tabler-icons-react";
import { MantineColorSelector } from "../../settings/common/mantine-color";
import { ILineBarChartSeriesItem, IVizLineBarChartPanel } from "./type";

export function VizLineBarChartPanel({ conf, setConf }: IVizLineBarChartPanel) {
  const submitButton = React.useRef<HTMLButtonElement>(null)
  const { series, ...restConf } = conf;
  const initialValues = React.useMemo(() => ({
    series: formList<ILineBarChartSeriesItem>(series ?? []),
    ...restConf
  }), [series, restConf]);

  const form = useForm({
    initialValues,
  });

  const addSeries = () => form.addListItem('series', {
    type: 'bar',
    name: randomId(),
    showSymbol: false,
    y_axis_data_key: 'value',
    stack: '',
    color: '#000'
  });

  const changed = React.useMemo(() => !_.isEqual(form.values, initialValues), [form.values, initialValues])

  React.useEffect(() => {
    if (changed) {
      submitButton?.current?.click()
    }
  }, [changed, submitButton.current])

  return (
    <Group direction="column" mt="md" spacing="xs" grow>
      <form onSubmit={form.onSubmit(setConf)}>
        <Group position="apart" mb="lg" sx={{ position: 'relative' }}>
          <Text>Chart Config</Text>
          <button ref={submitButton} type='submit' style={{ display: 'none' }}>Ghost submit</button>
        </Group>
        <TextInput size="md" mb="lg" label="X Axis Data Key" {...form.getInputProps('x_axis_data_key')} />
        <Group direction="column" grow>
          <Text mt="xl" mb={0}>Series</Text>
          {form.values.series.map((item, index) => (
            <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
              <TextInput
                label="Label"
                required
                sx={{ flex: 1 }}
                {...form.getListInputProps('series', index, 'name')}
              />
              <Group direction="row" grow noWrap>
                <TextInput
                  label="Y Axis Data key"
                  required
                  {...form.getListInputProps('series', index, 'y_axis_data_key')}
                />
                <TextInput
                  label="Stack ID"
                  placeholder="Stack bars by this ID"
                  {...form.getListInputProps('series', index, 'stack')}
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
          ))}
          <Group position="center" mt="xs">
            <Button onClick={addSeries}>
              Add a Series
            </Button>
          </Group>
        </Group>
      </form>
    </Group>
  )
}