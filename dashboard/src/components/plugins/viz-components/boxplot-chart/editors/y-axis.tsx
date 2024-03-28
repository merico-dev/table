import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { IBoxplotChartConf } from '../type';
import { useTranslation } from 'react-i18next';

interface IYAxisField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
}
export const YAxisField = ({ control, watch }: IYAxisField) => {
  const { t } = useTranslation();
  watch(['y_axis']);
  return (
    <>
      <Group grow noWrap>
        <Controller
          name="y_axis.name"
          control={control}
          render={({ field }) => <TextInput label={t('chart.y_axis.y_axis_name')} sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="y_axis.data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('chart.y_axis.y_axis_data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Stack>
        <Divider
          mt={10}
          mb={-15}
          variant="dashed"
          label={t('chart.axis.section_title.label_format')}
          labelPosition="center"
        />
        <Controller
          name={'y_axis.label_formatter'}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
    </>
  );
};
