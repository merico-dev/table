import { Checkbox, Divider, Group, Stack, TextInput } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SeriesUnitType } from './types';

type Props = {
  value: SeriesUnitType;
  onChange: (v: SeriesUnitType) => void;
  hiddenFileds?: Array<keyof SeriesUnitType>;
};

export const SeriesUnitField = forwardRef(({ value, onChange, hiddenFileds }: Props, ref: any) => {
  const { t } = useTranslation();

  const hiddenFiledSet = useMemo(() => new Set(hiddenFileds ?? []), [hiddenFileds]);
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
      {!hiddenFiledSet.has('text') && (
        <TextInput
          size="xs"
          placeholder={t('chart.unit.text.placeholder')}
          value={value.text}
          onChange={(e) => getChangeHandler('text')(e.currentTarget.value)}
        />
      )}
      <Group grow>
        {!hiddenFiledSet.has('show_in_tooltip') && (
          <Checkbox
            size="xs"
            label={t('chart.unit.show_in_tooltip')}
            checked={value.show_in_tooltip}
            onChange={(e) => getChangeHandler('show_in_tooltip')(e.currentTarget.checked)}
          />
        )}
        {!hiddenFiledSet.has('show_in_legend') && (
          <Checkbox
            size="xs"
            label={t('chart.unit.show_in_legend')}
            checked={value.show_in_legend}
            onChange={(e) => getChangeHandler('show_in_legend')(e.currentTarget.checked)}
          />
        )}
      </Group>
    </Stack>
  );
});
