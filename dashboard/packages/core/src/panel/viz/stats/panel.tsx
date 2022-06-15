import { Accordion, ActionIcon, Group, Select, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
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


  const { control, handleSubmit, watch, formState: { isDirty } } = useForm({ defaultValues });

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
        <Accordion offsetIcon={false} multiple>
          <Accordion.Item label="Content">
            <Group direction="column" grow>
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
            </Group>
          </Accordion.Item>
          <Accordion.Item label="Font">
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
          </Accordion.Item>
          <Accordion.Item label="Color">
            <Group direction="column" grow>
              <Controller
                name='value_field'
                control={control}
                render={(({ field }) => (
                  <TextInput
                    placeholder="Calc color with this field"
                    label="Value Field"
                    required
                    sx={{ flex: 1 }}
                    {...field}
                  />
                ))}
              />
              <Controller
                name="color.type"
                control={control}
                render={(({ field }) => (
                  <Select
                    label="Color Type"
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
          </Accordion.Item>
        </Accordion>
      </form>
    </Group>
  )
}