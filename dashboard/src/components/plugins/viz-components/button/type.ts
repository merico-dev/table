import { MantineColor, MantineSize, Variants } from '@mantine/core';

export interface IButtonConf {
  content: string;
  variant: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  color: MantineColor;
  size: MantineSize;
  compact: boolean;
  horizontal_align: 'left' | 'center' | 'right';
  vertical_align: 'top' | 'center' | 'bottom';
}

export const DEFAULT_CONFIG: IButtonConf = {
  content: 'Button',
  variant: 'filled',
  color: 'blue',
  size: 'xs',
  compact: false,
  horizontal_align: 'left',
  vertical_align: 'center',
};
