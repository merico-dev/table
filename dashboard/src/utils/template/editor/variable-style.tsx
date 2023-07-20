import { Divider, Group, Select, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { Path } from 'react-hook-form';
import { ColorArrayInput } from '../../../components/panel/settings/common/color-array-input';
import { MantineColorSelector } from '../../../components/panel/settings/common/mantine-color';
import { MantineFontWeightSlider } from '../../../components/panel/settings/common/mantine-font-weight';
import { TextArrayInput } from '../../../components/panel/settings/common/text-array-input';
import { ITemplateVariable } from '../types';

interface ITemplateVariableStyleField {
  value: ITemplateVariable;
  onChange: (v: ITemplateVariable) => void;
}

export const TemplateVariableStyleField = React.forwardRef(function _TemplateVariableStyleField(
  { value, onChange }: ITemplateVariableStyleField,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref: $TSFixMe,
) {
  const colorType = value.color.type;
  const handleChange = (path: Path<ITemplateVariable>, newValue: $TSFixMe) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  };

  return (
    <>
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
          <MantineColorSelector
            value={value.color.staticColor}
            onChange={(v) => handleChange('color.staticColor', v)}
          />
        )}
        {colorType === 'continuous' && (
          <>
            <TextArrayInput
              label="Value Range"
              value={value.color.valueRange}
              type="number"
              onChange={(v) => handleChange('color.valueRange', v)}
            />
            <ColorArrayInput
              label="Color Range"
              value={value.color.colorRange}
              onChange={(v) => handleChange('color.colorRange', v)}
            />
          </>
        )}
      </Stack>
    </>
  );
});
