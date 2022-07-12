import { Accordion, ActionIcon, Group, Select, Text, TextInput } from "@mantine/core";
import React from "react";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { Trash } from "tabler-icons-react";
import { AggregationSelector } from "../../../settings/common/aggregation-selector";
import { ColorArrayInput } from "../../../settings/common/color-array-input";
import { DataFieldSelector } from "../../../settings/common/data-field-selector";
import { MantineColorSelector } from "../../../settings/common/mantine-color";
import { MantineFontWeightSlider } from "../../../settings/common/mantine-font-weight";
import { NumbroFormatSelector } from "../../../settings/common/numbro-format-selector";
import { TextArrayInput } from "../../../settings/common/text-array-input";
import { IVizStatsConf, IVizStatsVariable } from "../types";

interface VariableField {
  control: Control<IVizStatsConf, any>;
  variableItem: IVizStatsVariable;
  index: number;
  remove: UseFieldArrayRemove;
  data: any[];
}

export function VariableField({ control, variableItem, index, remove, data }: VariableField) {
  const colorType = variableItem.color.type;
  return (
    <Group key={index} direction="column" grow my={0} p={0} sx={{ border: '1px solid #eee', borderTopColor: '#333', borderTopWidth: 2, position: 'relative' }}>
      <Accordion offsetIcon={false} multiple initialState={{ 0: true, 2: true }}>
        <Accordion.Item label="Data">
          <Controller
            name={`variables.${index}.name`}
            control={control}
            render={(({ field }) => (
              <TextInput label="Name" required {...field} />
            ))}
          />
          <Controller
            name={`variables.${index}.data_field`}
            control={control}
            render={(({ field }) => (
              <DataFieldSelector label="Data Field" required data={data} {...field} />
            ))}
          />
          <Controller
            name={`variables.${index}.aggregation`}
            control={control}
            render={(({ field }) => (
              <AggregationSelector label="Aggregation" {...field} />
            ))}
          />
          <Controller
            name={`variables.${index}.formatter`}
            control={control}
            render={(({ field }) => (
              <NumbroFormatSelector {...field} />
            ))}
          />
        </Accordion.Item>
        <Accordion.Item label="Typography">
          <Group direction="column" grow>
            <Controller
              name={`variables.${index}.size`}
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
              name={`variables.${index}.weight`}
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
              name={`variables.${index}.color.type`}
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
                name={`variables.${index}.color.staticColor`}
                control={control}
                render={(({ field }) => (
                  <MantineColorSelector {...field} />
                ))}
              />
            )}
            {colorType === 'continuous' && (
              <>
                <Controller
                  name={`variables.${index}.color.valueRange`}
                  control={control}
                  render={(({ field }) => (
                    <TextArrayInput label="Value Range" {...field} />
                  ))}
                />
                <Controller
                  name={`variables.${index}.color.colorRange`}
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
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group >

  )
}