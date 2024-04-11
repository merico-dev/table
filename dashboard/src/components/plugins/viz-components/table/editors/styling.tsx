import { Group, Stack, Switch, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ITableConf } from '../type';
import { MantineSizeSelector } from '~/components/panel/settings/common/mantine-size-selector';

interface IStylingFields {
  control: Control<ITableConf, $TSFixMe>;
  watch: UseFormWatch<ITableConf>;
}
export function StylingFields({ control, watch }: IStylingFields) {
  const { t } = useTranslation();
  watch(['horizontalSpacing', 'verticalSpacing', 'fontSize', 'striped', 'highlightOnHover']);
  return (
    <Stack spacing="xs">
      <Group position="apart" mb="lg" grow sx={{ '> *': { flexGrow: 1 } }}>
        <Controller
          name="horizontalSpacing"
          control={control}
          render={({ field }) => (
            <MantineSizeSelector disabled label={t('viz.table.style.horizontal_spacing')} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="verticalSpacing"
          control={control}
          render={({ field }) => (
            <MantineSizeSelector disabled label={t('viz.table.style.vertical_spacing')} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Group position="apart" mb="lg" grow sx={{ '> *': { flexGrow: 1 } }}>
        <Controller
          name="fontSize"
          control={control}
          render={({ field }) => (
            <TextInput
              label={t('style.font_size.label')}
              placeholder={t('style.font_size.placeholder')}
              required
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <Group position="apart" grow>
        <Controller
          name="striped"
          control={control}
          render={({ field }) => (
            <Switch
              label={t('viz.table.style.striped')}
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
            />
          )}
        />
        <Controller
          name="highlightOnHover"
          control={control}
          render={({ field }) => (
            <Switch
              label={t('viz.table.style.highlight_on_hover')}
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
            />
          )}
        />
      </Group>
    </Stack>
  );
}
