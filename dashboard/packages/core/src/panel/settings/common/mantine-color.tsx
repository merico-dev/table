import { Group, Select, TextInput, Text, useMantineTheme, ColorSwatch } from "@mantine/core";
import _ from "lodash";
import React from "react";

interface IMantineColorSelector {
  value?: string;
  onChange: (value: string) => void;
}

function _MantineColorSelector({ value, onChange }: IMantineColorSelector, ref: any) {
  const theme = useMantineTheme();

  const themeColors = React.useMemo(() => {
    return Object.entries(theme.colors).map(([color, profile]) => ({
      label: color,
      value: profile[6],
    }))
  }, [theme]);

  const isThemeColor = React.useMemo(() => {
    return themeColors.some(option => option.value === value);
  }, [value, themeColors]);

  return (
    <Group position="apart" spacing="xs">
      <TextInput
        placeholder="Set any color"
        value={!isThemeColor ? value : ''}
        onChange={(e) => onChange(e.currentTarget.value)}
        rightSection={<ColorSwatch color={!isThemeColor ? value! : 'transparent'} radius={4} />}
        variant={!isThemeColor ? 'default' : 'filled'}
        sx={{ maxWidth: '100%', flexGrow: 1 }}
      />
      <Text sx={{ flexGrow: 0 }}>or</Text>
      <Select
        data={themeColors}
        value={value}
        onChange={onChange}
        variant={isThemeColor ? 'default' : 'filled'}
        placeholder="Pick a theme color"
        icon={<ColorSwatch color={isThemeColor ? value! : 'transparent'} radius={4}/>}
        sx={{ maxWidth: '100%', flexGrow: 1 }}
      />
    </Group>
  )
}
export const MantineColorSelector = React.forwardRef(_MantineColorSelector)
