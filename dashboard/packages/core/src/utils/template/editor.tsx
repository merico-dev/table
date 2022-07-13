import { Accordion, Group, Select, Text, TextInput, TextInputProps } from "@mantine/core";
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

export function TemplateVariableField({ value, onChange, data }: ITemplateVariableField) {
  const colorType = value.color.type;
  const handleChange = (path: Path<ITemplateVariable>, newValue: any) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  }

  return (
    <Accordion offsetIcon={false} multiple initialState={{ 0: true, 2: true }}>
      <Accordion.Item label="Data">
        <Group direction="row" grow noWrap>
          <TextInput label="Name" required value={value.name} onChange={(e) => handleChange('name', e.currentTarget.value)} />
          <DataFieldSelector label="Data Field" required data={data} value={value.data_field} onChange={(v) => handleChange('data_field', v)} />
          <AggregationSelector label="Aggregation" value={value.aggregation} onChange={(v) => handleChange('aggregation', v)} />
        </Group>
        <NumbroFormatSelector value={value.formatter} onChange={(v) => handleChange('formatter', v)} />
      </Accordion.Item>
      <Accordion.Item label="Typography">
        <Group direction="column" grow>
          <TextInput
            label="Font Size"
            placeholder="10px, 1em, 1rem, 100%..."
            sx={{ flex: 1 }}
            value={value.size}
            onChange={(e) => handleChange('size', e.currentTarget.value)}
          />
        </Group>
        <Group position="apart" grow sx={{ '> *': { flexGrow: 1, maxWidth: '100%' } }}>
          <MantineFontWeightSlider label="Font Weight" value={value.weight} onChange={(v) => handleChange('weight', v)} />
        </Group>
      </Accordion.Item>
      <Accordion.Item label="Color">
        <Group direction="column" grow>
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
        </Group>
      </Accordion.Item>
    </Accordion>
  )
}
