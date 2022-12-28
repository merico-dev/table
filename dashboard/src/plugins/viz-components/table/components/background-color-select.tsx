import { Group, Select, Stack } from '@mantine/core';
import { useLatest } from 'ahooks';
import { isObject, isString } from 'lodash';
import { useContext, useState } from 'react';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { ColorInterpolationSelect } from '~/plugins/controls/color-interpolation-select';
import { CellBackgroundColorType } from '~/plugins/viz-components/table/type';
import { IColorManager, PluginContext } from '~/plugins';

import { IColorInterpolationConfig } from '~/types/plugin';

export interface IBackgroundColorSelectProps {
  value?: CellBackgroundColorType;
  onChange?: (value: CellBackgroundColorType) => void;
}

const ColorTypes = ['static', 'interpolation', 'none'];
const DEFAULT_STEPS = [
  { from: 0, to: 0 },
  { from: 100, to: 100 },
];

function getColorType(color?: CellBackgroundColorType) {
  if (!color) {
    return 'none';
  }
  if (isString(color)) {
    if (color === 'none') {
      return 'none';
    }
    return 'static';
  }
  return 'interpolation';
}

function getInitialStaticColor(colorManager: IColorManager, value?: CellBackgroundColorType): string {
  if (getColorType(value) === 'static') {
    return value as string;
  }
  return colorManager.getStaticColors()[0]?.value;
}

function getInitialInterpolationColor(
  colorManager: IColorManager,
  value?: CellBackgroundColorType,
): IColorInterpolationConfig {
  if (isObject(value)) {
    return value as IColorInterpolationConfig;
  }
  return {
    steps: DEFAULT_STEPS,
    interpolation: colorManager.encodeColor(colorManager.getColorInterpolations()[0]),
  };
}

export const BackgroundColorSelect = (props: IBackgroundColorSelectProps) => {
  const { colorManager } = useContext(PluginContext);
  const [colorType, setColorType] = useState(getColorType(props.value));
  const [staticColor, setStaticColor] = useState<string>(getInitialStaticColor(colorManager, props.value));
  const staticColorRef = useLatest(staticColor);
  const [interpolationColor, setInterpolationColor] = useState<IColorInterpolationConfig>(
    getInitialInterpolationColor(colorManager, props.value),
  );
  const interpolationColorRef = useLatest(interpolationColor);

  const handleColorTypeChange = (value: string | null) => {
    setColorType(value || 'none');
    if (value === 'static') {
      props.onChange?.(staticColorRef.current);
    } else if (value === 'none' || !value) {
      props.onChange?.('none');
    } else {
      props.onChange?.(interpolationColorRef.current);
    }
  };
  const handleStaticColorChange = (value: string) => {
    setStaticColor(value);
    props.onChange?.(value);
  };
  const handleInterpolationColorChange = (value: IColorInterpolationConfig) => {
    setInterpolationColor(value);
    props.onChange?.(value);
  };
  return (
    <Stack align="stretch">
      <Select label="Cell background" value={colorType || 'none'} onChange={handleColorTypeChange} data={ColorTypes} />
      {colorType === 'static' && <MantineColorSelector value={staticColor} onChange={handleStaticColorChange} />}
      {colorType === 'interpolation' && (
        <ColorInterpolationSelect
          colorManager={colorManager}
          value={interpolationColor}
          onChange={handleInterpolationColorChange}
        />
      )}
    </Stack>
  );
};
