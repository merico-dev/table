import { MantineColor, MantineSize, Variants } from '@mantine/core';
import { HorizontalAlign, VerticalAlign } from '../../editor-components';

export interface IButtonConf {
  content: string;
  variant: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  color: MantineColor;
  size: MantineSize;
  compact: boolean;
  horizontal_align: HorizontalAlign;
  vertical_align: VerticalAlign;
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
