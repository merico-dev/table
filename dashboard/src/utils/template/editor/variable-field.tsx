import { Box, Divider, Group, Text, TextInput } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { Path } from 'react-hook-form';
import { AggregationSelector } from '../../../components/panel/settings/common/aggregation-selector';
import { DataFieldSelector } from '../../../components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '../../../components/panel/settings/common/numbro-format-selector';
import { ITemplateVariable } from '../types';
import { TemplateVariableStyleField } from './variable-style';

interface ITemplateVariableField {
  value: ITemplateVariable;
  onChange: (v: ITemplateVariable) => void;
  withStyle?: boolean;
}

export const TemplateVariableField = React.forwardRef(function _TemplateVariableField(
  { value, onChange, withStyle = true }: ITemplateVariableField,
  ref: $TSFixMe,
) {
  const handleChange = (path: Path<ITemplateVariable>, newValue: $TSFixMe) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  };

  return (
    <Box px="sm" py="md" ref={ref}>
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
          value={value.data_field}
          onChange={(v) => handleChange('data_field', v)}
        />
      </Group>
      <AggregationSelector
        label="Aggregation"
        value={value.aggregation}
        onChange={(v) => handleChange('aggregation', v)}
      />

      <Divider my="xs" label="Format" labelPosition="center" />
      {value.aggregation.type !== 'custom' && (
        <NumbroFormatSelector value={value.formatter} onChange={(v) => handleChange('formatter', v)} />
      )}

      {withStyle && <TemplateVariableStyleField value={value} onChange={onChange} />}
    </Box>
  );
});
