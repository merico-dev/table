import { Divider, Group, Select, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { Path } from 'react-hook-form';
import { ColorArrayInput } from '../../../../../../components/panel/settings/common/color-array-input';
import { MantineColorSelector } from '../../../../../../components/panel/settings/common/mantine-color';
import { MantineFontWeightSlider } from '../../../../../../components/panel/settings/common/mantine-font-weight';
import { TextArrayInput } from '../../../../../../components/panel/settings/common/text-array-input';
import { ITemplateVariable } from '../../../../../../utils/template/types';
import { useTranslation } from 'react-i18next';

interface ITemplateVariableStyleField {
  value: ITemplateVariable;
  onChange: (v: ITemplateVariable) => void;
}

export const TemplateVariableStyleField = React.forwardRef(function _TemplateVariableStyleField(
  { value, onChange }: ITemplateVariableStyleField,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref: $TSFixMe,
) {
  const { t } = useTranslation();
  const colorType = value.color.type;
  const handleChange = (path: Path<ITemplateVariable>, newValue: $TSFixMe) => {
    const v = _.cloneDeep(value);
    _.set(v, path, newValue);
    onChange(v);
  };

  const changeColor = (c: 'static' | 'continuous') => {
    if (c === 'static') {
      onChange({
        ...value,
        color: {
          type: 'static',
          staticColor: '#25262B',
        },
      });
      return;
    }
    onChange({
      ...value,
      color: {
        type: 'continuous',
        colorRange: [],
        valueRange: [],
      },
    });
  };

  return (
    <>
      <Stack>
        <TextInput
          label={t('style.font_size.label')}
          placeholder={t('styles.font_size.placeholder')}
          sx={{ flex: 1 }}
          value={value.size}
          onChange={(e) => handleChange('size', e.currentTarget.value)}
        />
      </Stack>

      <Group position="apart" grow sx={{ '> *': { flexGrow: 1, maxWidth: '100%' } }}>
        <MantineFontWeightSlider
          label={t('style.font_weight.label')}
          value={value.weight}
          onChange={(v) => handleChange('weight', v)}
        />
      </Group>

      <Divider mt="lg" mb={0} variant="dashed" label={t('style.label')} labelPosition="center" />
      <Stack>
        <Select
          label="Color Type"
          data={[
            { label: 'Static Color', value: 'static' },
            { label: 'Continuous Color', value: 'continuous' },
          ]}
          value={value.color.type}
          onChange={changeColor}
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
