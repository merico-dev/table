import { Accordion, Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import React from 'react';
import { Path } from 'react-hook-form';
import { AggregationSelector } from '~/components/panel/settings/common/aggregation-selector';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { ITemplateVariable } from '~/utils';
import { TemplateVariableStyleField } from './variable-style';

interface ITemplateVariableField {
  value: ITemplateVariable;
  onChange: (v: ITemplateVariable) => void;
  withStyle?: boolean;
  remove: () => void;
}

// todo: make it faster
export const TemplateVariableField = React.forwardRef(function _TemplateVariableField(
  { value, onChange, withStyle = true, remove }: ITemplateVariableField,
  ref: $TSFixMe,
) {
  const handleChange = (path: Path<ITemplateVariable>, newValue: $TSFixMe) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  };

  return (
    <Stack ref={ref}>
      <Stack spacing="xs" px="sm" py="md" sx={{ border: '1px solid #e9ecef' }}>
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
          pt={0}
          value={value.aggregation}
          onChange={(v) => handleChange('aggregation', v)}
          withFallback
        />

        {value.aggregation.type !== 'custom' && (
          <>
            <Divider mt="xl" mb={0} label="Format" labelPosition="center" variant="dashed" />
            <NumbroFormatSelector value={value.formatter} onChange={(v) => handleChange('formatter', v)} />
          </>
        )}
      </Stack>
      {withStyle && (
        <Accordion variant="contained">
          <Accordion.Item value="Styles">
            <Accordion.Control icon={<Text size="xl">🖼️</Text>}>Styles</Accordion.Control>
            <Accordion.Panel>
              <TemplateVariableStyleField value={value} onChange={onChange} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}

      <Button mt={20} leftIcon={<IconTrash size={16} />} color="red" variant="light" onClick={remove}>
        Delete this Variable
      </Button>
    </Stack>
  );
});
