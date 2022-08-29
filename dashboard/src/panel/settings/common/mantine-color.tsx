import { Group, Select, TextInput, Text, ColorSwatch } from '@mantine/core';
import React, { useContext } from 'react';
import { PluginContext } from '../../../plugins';

interface IMantineColorSelector {
  value?: string;
  onChange: (value: string) => void;
}

function _MantineColorSelector({ value, onChange }: IMantineColorSelector, ref: any) {
  const { colorManager } = useContext(PluginContext);

  const themeColors = React.useMemo(() => {
    const colors = colorManager.getStaticColors();
    return colors.map((color) => ({
      label: color.name,
      group: color.category,
      // todo: select color by reference instead of value, e.g. $category.name
      value: color.value,
    }));
  }, [colorManager]);

  const isThemeColor = React.useMemo(() => {
    return themeColors.some((option) => option.value === value);
  }, [value, themeColors]);

  return (
    <Group position="apart" spacing={4}>
      <TextInput
        placeholder="Set any color"
        value={!isThemeColor ? value : ''}
        onChange={(e) => onChange(e.currentTarget.value)}
        rightSection={<ColorSwatch color={!isThemeColor ? value! : 'transparent'} radius={4} />}
        variant={!isThemeColor ? 'default' : 'filled'}
        sx={{ maxWidth: '46%', flexGrow: 1 }}
      />
      <Text sx={{ flexGrow: 0 }}>or</Text>
      <Select
        data={themeColors}
        value={value}
        onChange={onChange}
        variant={isThemeColor ? 'default' : 'filled'}
        placeholder="Pick a theme color"
        icon={<ColorSwatch color={isThemeColor ? value! : 'transparent'} radius={4} />}
        sx={{ maxWidth: '46%', flexGrow: 1 }}
      />
    </Group>
  );
}

export const MantineColorSelector = React.forwardRef(_MantineColorSelector);
