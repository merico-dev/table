import { Box, Divider, Group, Stack, Switch, Tooltip } from '@mantine/core';
import { forwardRef } from 'react';
import { TEchartsDataZoomConfig } from './types';
import { useTranslation } from 'react-i18next';

interface IEchartsZoomingField {
  value: TEchartsDataZoomConfig;
  onChange: (v: TEchartsDataZoomConfig) => void;
}

export const EchartsZoomingField = forwardRef(({ value, onChange }: IEchartsZoomingField, _ref: any) => {
  const { t } = useTranslation();
  const getSetter = (k: keyof TEchartsDataZoomConfig) => (v: boolean) => {
    onChange({
      ...value,
      [k]: v,
    });
  };

  return (
    <Stack>
      <Divider variant="dashed" label={t('chart.zooming.scroll.label')} labelPosition="center" />
      <Group>
        <Box sx={{ flexGrow: 1 }}>
          <Switch
            label={t('chart.zooming.scroll.x_axis')}
            checked={value.x_axis_scroll}
            onChange={(event) => getSetter('x_axis_scroll')(event.currentTarget.checked)}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Switch
            label={t('chart.zooming.scroll.y_axis')}
            checked={value.y_axis_scroll}
            onChange={(event) => getSetter('y_axis_scroll')(event.currentTarget.checked)}
          />
        </Box>
      </Group>
      <Divider variant="dashed" label={t('chart.zooming.slider.label')} labelPosition="center" />
      <Group>
        <Box sx={{ flexGrow: 1 }}>
          <Switch
            label={t('chart.zooming.slider.x_axis')}
            checked={value.x_axis_slider}
            onChange={(event) => getSetter('x_axis_slider')(event.currentTarget.checked)}
          />
        </Box>
        <Tooltip label={t('chart.zooming.slider.y_axis_disabled')}>
          <Box sx={{ flexGrow: 1 }}>
            <Switch
              label={t('chart.zooming.slider.y_axis')}
              disabled={!value.y_axis_slider}
              checked={value.y_axis_slider}
              onChange={(event) => getSetter('y_axis_slider')(event.currentTarget.checked)}
            />
          </Box>
        </Tooltip>
      </Group>
    </Stack>
  );
});
