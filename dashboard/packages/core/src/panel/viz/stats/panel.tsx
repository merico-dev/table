import { Accordion, ActionIcon, ColorInput, Group, Select, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { IVizPanelProps } from "../../../types/viz-panel";
import { MantineFontWeightSlider } from "../../settings/common/mantine-font-weight";
import { IVizStatsConf } from "./types";
import { MantineColorSelector } from "../../settings/common/mantine-color";
import { TextArrayInput } from "../../settings/common/text-array-input";
import { ColorArrayInput } from "../../settings/common/color-array-input";
import { NumbroFormatSelector } from "../../settings/common/numbro-format-selector";
import { DataFieldSelector } from "../../settings/common/data-field-selector";

export function VizStatsPanel({ conf, setConf, data }: IVizPanelProps) {
  const defaultValues: IVizStatsConf = _.merge({}, {
    align: 'center',
    size: '100px',
    weight: 'bold',
    color: {
      type: 'static',
      staticColor: 'red',
    },
    content: {
      prefix: '',
      data_field: '',
      formatter: {
        output: 'number',
        mantissa: 0,
      },
      postfix: '',
    }
  } as const, conf);


  const { control, handleSubmit, watch, formState: { isDirty } } = useForm({ defaultValues });

  const colorType = watch('color.type')
  watch('color.valueField')

  return (
    <Group direction="column" mt="md" spacing="xs" grow noWrap>
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text weight={500}>Stats Configurations</Text>
          <ActionIcon type='submit' mr={5} variant="filled" color="blue" disabled={!isDirty}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Accordion offsetIcon={false} multiple initialState={{ 0: true, 2: true }}>
          <Accordion.Item label="Content">
            <Group direction="column" grow>
              <Group direction="row" grow noWrap>
                <Controller
                  name='content.prefix'
                  control={control}
                  render={(({ field }) => (
                    <TextInput label="Prefix" sx={{ flexGrow: 1 }} {...field} />
                  ))}
                />
                <Controller
                  name='content.data_field'
                  control={control}
                  render={(({ field }) => (
                    <DataFieldSelector label="Data Field" required data={data} {...field} />
                  ))}
                />
                <Controller
                  name='content.postfix'
                  control={control}
                  render={(({ field }) => (
                    <TextInput label="Postfix" sx={{ flexGrow: 1 }} {...field} />
                  ))}
                />
              </Group>
              <Controller
                name='content.formatter'
                control={control}
                render={(({ field }) => (
                  <NumbroFormatSelector {...field} />
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
                  name="color.staticColor"
                  control={control}
                  render={(({ field }) => (
                    <MantineColorSelector {...field} />
                  ))}
                />
              )}
              {colorType === 'continuous' && (
                <>
                  <Controller
                    name='color.valueField'
                    control={control}
                    defaultValue=""
                    render={(({ field }) => (
                      <TextInput
                        placeholder="Calculate color with this field"
                        label="Value Field"
                        required
                        sx={{ flex: 1 }}
                        {...field}
                      />
                    ))}
                  />
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
                      <ColorArrayInput label="Color Range" {...field} />
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