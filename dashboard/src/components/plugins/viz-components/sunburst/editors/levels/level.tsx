import { Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  IEchartsLabelPosition,
  LabelPositionSelector,
} from '~/components/plugins/common-echarts-fields/label-position';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';
import { ISunburstConf } from '../../type';

interface ILevelField {
  control: Control<ISunburstConf, $TSFixMe>;
  index: number;
}

export const LevelField = ({ control, index }: ILevelField) => {
  const { t, i18n } = useTranslation();

  const rotationOptions = useMemo(
    () => [
      { label: t('viz.sunburst_chart.label.rotate.radial'), value: 'radial' },
      { label: t('viz.sunburst_chart.label.rotate.tangential'), value: 'tangential' },
      { label: t('viz.sunburst_chart.label.rotate.none'), value: '0' },
    ],
    [i18n.language],
  );
  return (
    <Stack>
      <Group grow wrap="nowrap">
        <Controller
          name={`levels.${index}.r0`}
          control={control}
          render={({ field }) => (
            <TextInput label={t('viz.sunburst_chart.level.inside_radius')} placeholder="0%" {...field} />
          )}
        />
        <Controller
          name={`levels.${index}.r`}
          control={control}
          render={({ field }) => (
            <TextInput label={t('viz.sunburst_chart.level.outside_radius')} placeholder="50%" {...field} />
          )}
        />
      </Group>
      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.label.label_full')} labelPosition="center" />
      <Controller
        name={`levels.${index}.label.show_label_tolerance`}
        control={control}
        render={({ field }) => (
          <NumberInput
            label={t('viz.sunburst_chart.label.show_label_tolerance')}
            decimalScale={4}
            step={0.0005}
            min={0}
            max={1}
            {...field}
          />
        )}
      />
      <Group grow wrap="nowrap">
        <Controller
          name={`levels.${index}.label.rotate`}
          control={control}
          render={({ field }) => (
            <Select label={t('viz.sunburst_chart.label.rotate.label')} data={rotationOptions} {...field} />
          )}
        />
        <Controller
          name={`levels.${index}.label.align`}
          control={control}
          render={({ field }) => <NameTextAlignSelector {...field} />}
        />
      </Group>
      <Group grow wrap="nowrap">
        <Controller
          name={`levels.${index}.label.position`}
          control={control}
          render={({ field }) => (
            <LabelPositionSelector
              label={t('chart.label_position.label')}
              {...field}
              onChange={(v?: IEchartsLabelPosition) => {
                v && field.onChange(v);
              }}
            />
          )}
        />
        <Controller
          name={`levels.${index}.label.padding`}
          control={control}
          render={({ field }) => <NumberInput label={t('chart.padding')} min={0} hideControls {...field} />}
        />
      </Group>
    </Stack>
  );
};
