import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { DeviceFloppy } from "tabler-icons-react";
import _ from "lodash";
import { DataFieldSelector } from "../../settings/common/data-field-selector";
import { IVizPanelProps } from "../../../types";

export function VizBar3DPanel({ conf, setConf, data }: IVizPanelProps) {
  const defaultValues = _.assign({}, {
    "x_axis_data_key": "x",
    "y_axis_data_key": "y",
    "z_axis_data_key": "z",
    "xAxis3D": {
      "type": "value",
      "name": "X Axis Name"
    },
    "yAxis3D": {
      "type": "value",
      "name": "Y Axis Name"
    },
    "zAxis3D": {
      "type": "value",
      "name": "Z Axis Name"
    }
  }, conf);

  const { control, handleSubmit, formState } = useForm({ defaultValues });

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Text>X Axis</Text>
        <Group position="apart" grow p="md" sx={{ position: 'relative', border: '1px solid #eee' }}>
          <Controller
            name='x_axis_data_key'
            control={control}
            render={(({ field }) => (
              <DataFieldSelector label="Data Field" required data={data} {...field} />
            ))}
          />
          <Controller
            name='xAxis3D.name'
            control={control}
            render={(({ field }) => (
              <TextInput sx={{ flexGrow: 1 }} size="md" label="Name" {...field} />
            ))}
          />
        </Group>

        <Text mt="lg">Y Axis</Text>
        <Group position="apart" grow p="md" sx={{ position: 'relative', border: '1px solid #eee' }}>
          <Controller
            name='y_axis_data_key'
            control={control}
            render={(({ field }) => (
              <DataFieldSelector label="Data Field" required data={data} {...field} />
            ))}
          />
          <Controller
            name='yAxis3D.name'
            control={control}
            render={(({ field }) => (
              <TextInput sx={{ flexGrow: 1 }} size="md" label="Name" {...field} />
            ))}
          />
        </Group>

        <Text mt="lg">Z Axis</Text>
        <Group position="apart" grow p="md" sx={{ position: 'relative', border: '1px solid #eee' }}>
          <Controller
            name='z_axis_data_key'
            control={control}
            render={(({ field }) => (
              <DataFieldSelector label="Data Field" required data={data} {...field} />
            ))}
          />
          <Controller
            name='zAxis3D.name'
            control={control}
            render={(({ field }) => (
              <TextInput sx={{ flexGrow: 1 }} size="md" label="Name" {...field} />
            ))}
          />
        </Group>
        <Group position="center" mt="xl" grow sx={{ width: '60%' }} mx="auto">
          <Button color="blue" type="submit">
            <DeviceFloppy size={20} /><Text ml="md">Save</Text>
          </Button>
        </Group>
      </form>
    </Stack>
  )
}