import { Divider, Group, Select } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { AlignItemsOptions, JustifyContentOptions } from '~/panel/settings/common/css-types';
import { TMericoStatsConf } from '../../type';

interface IProps {
  control: Control<TMericoStatsConf, $TSFixMe>;
  watch: UseFormWatch<TMericoStatsConf>;
}

export function StylesField({ control, watch }: IProps) {
  watch('styles');
  return (
    <>
      <Divider mt={15} variant="dashed" label="Styles" labelPosition="center" />
      <Group>
        <Controller
          name={'styles.justify'}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Justify Content" required data={JustifyContentOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={'styles.align'}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Align" required data={AlignItemsOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
    </>
  );
}
