import { Box, Divider, Group, TextInput } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { Path } from 'react-hook-form';
import { AggregationSelector } from '../../../panel/settings/common/aggregation-selector';
import { DataFieldSelector } from '../../../panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '../../../panel/settings/common/numbro-format-selector';
import { ITemplateVariable } from '~/utils/template';
import { TemplateVariableStyleField } from '~/utils/template/editor/variable-style';

interface ITemplateVariableField {
  value: ITemplateVariable;
  onChange: (v: ITemplateVariable) => void;
  data: $TSFixMe[];
  withStyle?: boolean;
}

// todo: make it faster
export const TemplateVariableField = React.forwardRef(function _TemplateVariableField(
  { value, onChange, data, withStyle = true }: ITemplateVariableField,
  ref: $TSFixMe,
) {
  const handleChange = (path: Path<ITemplateVariable>, newValue: $TSFixMe) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  };

  return (
    <Box px="sm" py="md" ref={ref}>
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
      </Group>
      <AggregationSelector
        label="Aggregation"
        value={value.aggregation}
        onChange={(v) => handleChange('aggregation', v)}
      />

      <Divider my="xs" label="Format" labelPosition="center" />
      <NumbroFormatSelector value={value.formatter} onChange={(v) => handleChange('formatter', v)} />

      {withStyle && <TemplateVariableStyleField value={value} onChange={onChange} />}
    </Box>
  );
});
