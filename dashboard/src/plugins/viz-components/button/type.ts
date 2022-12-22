import { ButtonVariant, MantineColor, MantineSize } from '@mantine/core';

export interface IButtonConf {
  content: string;
  variant: ButtonVariant;
  color: MantineColor;
  size: MantineSize;
  compact: boolean;
  horizontal_align: 'left' | 'center' | 'right';
}

export const DEFAULT_CONFIG: IButtonConf = {
  content: 'Button',
  variant: 'filled',
  color: 'blue',
  size: 'xs',
  compact: false,
  horizontal_align: 'left',
};
