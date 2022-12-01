import { ButtonVariant, MantineColor, MantineSize } from '@mantine/core';

export interface IButtonConf {
  content: string;
  variant: ButtonVariant;
  color: MantineColor;
  size: MantineSize;
  compact: boolean;
}

export const DEFAULT_CONFIG: IButtonConf = {
  content: 'Button',
  variant: 'filled',
  color: 'blue',
  size: 'xs',
  compact: false,
};
