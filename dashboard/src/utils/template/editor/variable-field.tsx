import { Box, Divider, Group, Text, TextInput } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { Path } from 'react-hook-form';
import { AggregationSelector } from '../../../panel/settings/common/aggregation-selector';
import { DataFieldSelector } from '../../../panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '../../../panel/settings/common/numbro-format-selector';
import { ITemplateVariable } from '../types';
import { TemplateVariableStyleField } from './variable-style';

interface ITemplateVariableField {
  value: ITemplateVariable;
  onChange: (v: ITemplateVariable) => void;
  data: any[];
  withStyle?: boolean;
}

export const TemplateVariableField = React.forwardRef(function _TemplateVariableField(
  { value, onChange, data, withStyle = true }: ITemplateVariableField,
  _ref: any,
) {
  const handleChange = (path: Path<ITemplateVariable>, newValue: any) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  };

  return (
    <Box px="sm" py="md">
      <Text weight="bold" pb={0}>
        {value.name}
      </Text>

      <Divider my="xs" label="Data" labelPosition="center" />
      <Group grow noWrap>
        <TextInput
          label="Name"
          required
          value={value.name}
          onChange={(e) => handleChange('name', e.currentTarget.value)}
        />
        <DataFieldSelector
          label="Data Field"
          required
          data={data}
          value={value.data_field}
          onChange={(v) => handleChange('data_field', v)}
        />
        <AggregationSelector
          label="Aggregation"
          value={value.aggregation}
          onChange={(v) => handleChange('aggregation', v)}
        />
      </Group>

      <Divider my="xs" label="Format" labelPosition="center" />
      <NumbroFormatSelector value={value.formatter} onChange={(v) => handleChange('formatter', v)} />

      {withStyle && <TemplateVariableStyleField value={value} onChange={onChange} />}
    </Box>
  );
});
