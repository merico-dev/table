import { ActionIcon, Group, JsonInput, Select, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { Prism } from "@mantine/prism";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { IVizPanelProps } from "../../../types/viz-panel";
import { MantineFontWeightSlider } from "../../settings/common/mantine-font-weight";
import { IVizStatsConf } from "./types";
import { MantineColorSelector } from "../../settings/common/mantine-color";
import { TextArrayInput } from "../../settings/common/text-array-input";

export function VizStatsPanel({ conf, setConf }: IVizPanelProps) {
  const defaultValues: IVizStatsConf = _.merge({}, {
    align: 'center',
    size: '100px',
    template: '',
    weight: 'bold',
    value_field: 'value',
    color: {
      type: 'static',
      value: 'red',
    }
  } as const, conf);


  const { control, handleSubmit, watch, getValues, formState: { isDirty } } = useForm({ defaultValues });

  const colorType = watch('color.type')

  return (
    <Group direction="column" mt="md" spacing="xs" grow noWrap>
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text weight={500}>Stats Configurations</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!isDirty}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Group direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
          <Controller
            name='value_field'
            control={control}
            render={(({ field }) => (
              <TextInput
                placeholder="Read this field as value"
                label="Value Field"
                required
                sx={{ flex: 1 }}
                {...field}
              />
            ))}
          />
          <Controller
            name='template'
            control={control}
            render={(({ field }) => (
              <TextInput
                placeholder="Time: ${new Date().toISOString()}"
                label="Content Template"
                required
                sx={{ flex: 1 }}
                {...field}
              />
            ))}
          />
          <Group direction="column" grow>
            <Controller
              name="color.type"
              control={control}
              render={(({ field }) => (
                <Select
                  label="Type"
                  data={[
                    { label: 'Static Color', value: 'static' },
                    { label: 'Continuous Color', value: 'continuous' },
                  ]}
                  {...field}
                />
              ))}
            />
            {colorType === 'static' && (
              <Controller
                name="color.value"
                control={control}
                render={(({ field }) => (
                  <MantineColorSelector {...field} />
                ))}
              />
            )}
            {colorType === 'continuous' && (
              <>
                <Controller
                  name="color.valueRange"
                  control={control}
                  render={(({ field }) => (
                    <TextArrayInput label="Value Range" {...field} />
                  ))}
                />
                <Controller
                  name="color.colorRange"
                  control={control}
                  render={(({ field }) => (
                    <TextArrayInput label="Color Range" {...field} />
                  ))}
                />
              </>
            )}
          </Group>
          <Group direction="column" grow>
            <Controller
              name='size'
              control={control}
              render={(({ field }) => (
                <TextInput
                  label="Font Size"
                  placeholder="10px, 1em, 1rem, 100%..."
                  sx={{ flex: 1 }}
                  {...field}
                />
              ))}
            />
          </Group>
          <Group position="apart" grow sx={{ '> *': { flexGrow: 1, maxWidth: '100%' } }}>
            <Controller
              name='weight'
              control={control}
              render={(({ field }) => (
                <MantineFontWeightSlider label="Font Weight" {...field} />
              ))}
            />
          </Group>
        </Group>

        <Text size="sm" weight={500} mt="md">
          Current Configuration:
        </Text>
        <Prism language="json" colorScheme="dark" noCopy>{JSON.stringify(getValues(), null, 2)}</Prism>
      </form>
    </Group>
  )
}