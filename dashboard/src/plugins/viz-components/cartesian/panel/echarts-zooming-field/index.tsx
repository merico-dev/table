import { Box, Divider, Group, Stack, Switch, Tooltip } from '@mantine/core';
import { forwardRef } from 'react';
import { TEchartsDataZoomConfig } from './types';

interface IEchartsZoomingField {
  value: TEchartsDataZoomConfig;
  onChange: (v: TEchartsDataZoomConfig) => void;
}

export const EchartsZoomingField = forwardRef(({ value, onChange }: IEchartsZoomingField, _ref: any) => {
  const getSetter = (k: keyof TEchartsDataZoomConfig) => (v: boolean) => {
    onChange({
      ...value,
      [k]: v,
    });
  };

  return (
    <Stack>
      <Divider variant="dashed" label="Scroll to Zoom" labelPosition="center" />
      <Group>
        <Box sx={{ flexGrow: 1 }}>
          <Switch
            label="Enable on X Axis"
            checked={value.x_axis_scroll}
            onChange={(event) => getSetter('x_axis_scroll')(event.currentTarget.checked)}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Switch
            label="Enable on Y Axis"
            checked={value.y_axis_scroll}
            onChange={(event) => getSetter('y_axis_scroll')(event.currentTarget.checked)}
          />
        </Box>
      </Group>
      <Divider variant="dashed" label="Slider for Zooming" labelPosition="center" />
      <Group>
        <Box sx={{ flexGrow: 1 }}>
          <Switch
            label="Slider for X Axis"
            checked={value.x_axis_slider}
            onChange={(event) => getSetter('x_axis_slider')(event.currentTarget.checked)}
          />
        </Box>
        <Tooltip label="Not available for now, will overlap y-axis's label">
          <Box sx={{ flexGrow: 1 }}>
            <Switch
              label="Slider for Y Axis"
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
