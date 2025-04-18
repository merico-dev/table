import { Checkbox, Divider, Group, Stack, TextInput } from '@mantine/core';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SeriesUnitType } from './types';

interface Props {
  value: SeriesUnitType;
  onChange: (v: SeriesUnitType) => void;
}

export const SeriesUnitField = forwardRef(({ value, onChange }: Props, ref: any) => {
  const { t } = useTranslation();
  const getChangeHandler =
    <K extends keyof SeriesUnitType>(field: K) =>
    (v: SeriesUnitType[K]) => {
      onChange({
        ...value,
        [field]: v,
      });
    };
  return (
    <Stack ref={ref} gap="sm">
      <Divider mb={-10} label={t('chart.unit.title')} labelPosition="center" variant="dashed" />
      <TextInput
        size="xs"
        placeholder={t('chart.unit.text.placeholder')}
        value={value.text}
        onChange={(e) => getChangeHandler('text')(e.currentTarget.value)}
      />
      <Group grow>
        <Checkbox
          size="xs"
          label={t('chart.unit.show_in_tooltip')}
          checked={value.show_in_tooltip}
          onChange={(e) => getChangeHandler('show_in_tooltip')(e.currentTarget.checked)}
        />
        <Checkbox
          size="xs"
          label={t('chart.unit.show_in_legend')}
          checked={value.show_in_legend}
          onChange={(e) => getChangeHandler('show_in_legend')(e.currentTarget.checked)}
        />
      </Group>
    </Stack>
  );
});
