import { Group, Select } from '@mantine/core';
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
  const [interpolationColor, setInterpolationColor] = useState<IColorInterpolationConfig>(
    getInitialInterpolationColor(colorManager, props.value),
  );
  const notifyChange = (color: CellBackgroundColorType | null) => {
    switch (color) {
      case 'static':
        props.onChange?.(staticColor);
        break;
      case 'interpolation':
        props.onChange?.(interpolationColor);
        break;
      default:
        props.onChange?.('none');
    }
  };

  const handleColorTypeChange = (value: string | null) => {
    setColorType(value || 'none');
    notifyChange(value);
  };
  const handleStaticColorChange = (value: string) => {
    setStaticColor(value);
    notifyChange(value);
  };
  const handleInterpolationColorChange = (value: IColorInterpolationConfig) => {
    setInterpolationColor(value);
    notifyChange(value);
  };
  return (
    <Group align="end">
      <Select label="Cell background" value={colorType || 'none'} onChange={handleColorTypeChange} data={ColorTypes} />
      {colorType === 'static' && <MantineColorSelector value={staticColor} onChange={handleStaticColorChange} />}
      {colorType === 'interpolation' && (
        <ColorInterpolationSelect
          colorManager={colorManager}
          value={interpolationColor}
          onChange={handleInterpolationColorChange}
        />
      )}
    </Group>
  );
};
