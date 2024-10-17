import { Accordion, Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import React from 'react';
import { Path } from 'react-hook-form';
import { AggregationSelector } from '~/components/panel/settings/common/aggregation-selector';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { ITemplateVariable } from '~/utils';
import { useTranslation } from 'react-i18next';

interface ITemplateVariableField {
  value: ITemplateVariable;
  onChange: (v: ITemplateVariable) => void;
  remove: () => void;
}

// todo: make it faster
export const TemplateVariableField = React.forwardRef(function _TemplateVariableField(
  { value, onChange, remove }: ITemplateVariableField,
  ref: $TSFixMe,
) {
  const { t } = useTranslation();
  const handleChange = (path: Path<ITemplateVariable>, newValue: $TSFixMe) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  };

  return (
    <Stack ref={ref}>
      <Stack gap="xs" px="sm" py="md" sx={{ border: '1px solid #e9ecef' }}>
        <Group grow wrap="nowrap">
          <TextInput
            label={t('common.name')}
            required
            value={value.name}
            onChange={(e) => handleChange('name', e.currentTarget.value)}
          />
          <DataFieldSelector
            label={t('common.data_field')}
            required
            value={value.data_field}
            onChange={(v) => handleChange('data_field', v)}
          />
        </Group>
        <AggregationSelector
          label={t('panel.variable.aggregation.label')}
          pt={0}
          value={value.aggregation}
          onChange={(v) => handleChange('aggregation', v)}
          withFallback
        />

        {value.aggregation.type !== 'custom' && (
          <>
            <Divider mt="xl" mb={0} label={t('numbro.format.label')} labelPosition="center" variant="dashed" />
            <NumbroFormatSelector value={value.formatter} onChange={(v) => handleChange('formatter', v)} />
          </>
        )}
      </Stack>

      <Button mt={20} leftIcon={<IconTrash size={16} />} color="red" variant="light" onClick={remove}>
        {t('panel.variable.delete')}
      </Button>
    </Stack>
  );
});
