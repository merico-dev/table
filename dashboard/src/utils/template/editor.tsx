import { Box, Divider, Group, Select, Stack, Text, TextInput, TextInputProps } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import _ from "lodash";
import React, { ChangeEventHandler } from "react";
import { Control, Controller, Path } from "react-hook-form";
import { AggregationSelector } from "../../panel/settings/common/aggregation-selector";
import { ColorArrayInput } from "../../panel/settings/common/color-array-input";
import { DataFieldSelector } from "../../panel/settings/common/data-field-selector";
import { MantineColorSelector } from "../../panel/settings/common/mantine-color";
import { MantineFontWeightSlider } from "../../panel/settings/common/mantine-font-weight";
import { NumbroFormatSelector } from "../../panel/settings/common/numbro-format-selector";
import { TextArrayInput } from "../../panel/settings/common/text-array-input";
import { ITemplateVariable } from "./types";

export function getANewVariable() {
  return {
    name: randomId(),
    size: '20px',
    weight: 'bold',
    color: {
      type: 'static',
      staticColor: 'blue',
    },
    data_field: '',
    aggregation: 'none',
    formatter: {
      output: 'number',
      mantissa: 0,
    },
  } as ITemplateVariable;
}

interface ITemplateInput extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const TemplateInput = React.forwardRef(function TemplateInput({ value, onChange, ...rest }: ITemplateInput, ref: any) {
  return (
    <TextInput
      ref={ref}
      value={value}
      onChange={onChange}
      {...rest}
    />
  )
})

interface ITemplateVariableField {
  value: ITemplateVariable;
  onChange: (v: ITemplateVariable) => void;
  data: any[];
}

export const TemplateVariableField = React.forwardRef(function _TemplateVariableField({ value, onChange, data }: ITemplateVariableField, _ref: any) {
  const colorType = value.color.type;
  const handleChange = (path: Path<ITemplateVariable>, newValue: any) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  }

  return (
    <Box px="sm" py="md">
      <Text weight="bold" pb={0}>{value.name}</Text>

      <Divider my="xs" label="Data" labelPosition="center" />
      <Group grow noWrap>
        <TextInput label="Name" required value={value.name} onChange={(e) => handleChange('name', e.currentTarget.value)} />
        <DataFieldSelector label="Data Field" required data={data} value={value.data_field} onChange={(v) => handleChange('data_field', v)} />
        <AggregationSelector label="Aggregation" value={value.aggregation} onChange={(v) => handleChange('aggregation', v)} />
      </Group>
      <NumbroFormatSelector value={value.formatter} onChange={(v) => handleChange('formatter', v)} />

      <Divider my="xs" label="Typography" labelPosition="center" />
      <Stack>
        <TextInput
          label="Font Size"
          placeholder="10px, 1em, 1rem, 100%..."
          sx={{ flex: 1 }}
          value={value.size}
          onChange={(e) => handleChange('size', e.currentTarget.value)}
        />
      </Stack>

      <Group position="apart" grow sx={{ '> *': { flexGrow: 1, maxWidth: '100%' } }}>
        <MantineFontWeightSlider label="Font Weight" value={value.weight} onChange={(v) => handleChange('weight', v)} />
      </Group>

      <Divider my="xs" label="Style" labelPosition="center" />
      <Stack>
        <Select
          label="Color Type"
          data={[
            { label: 'Static Color', value: 'static' },
            { label: 'Continuous Color', value: 'continuous' },
          ]}
          value={value.color.type}
          onChange={(v) => handleChange('color.type', v)}
        />
        {colorType === 'static' && (
          <MantineColorSelector value={value.color.staticColor} onChange={(v) => handleChange('color.staticColor', v)} />
        )}
        {colorType === 'continuous' && (
          <>
            <TextArrayInput label="Value Range" value={value.color.valueRange} onChange={(v) => handleChange('color.valueRange', v)} />
            <ColorArrayInput label="Color Range" value={value.color.colorRange} onChange={(v) => handleChange('color.colorRange', v)} />
          </>
        )}
      </Stack>
    </Box>
  )
})
