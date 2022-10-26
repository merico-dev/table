import { MantineSize } from '@mantine/core';

export interface IStyles {
  size: MantineSize;
  spacing: MantineSize;
  button: {
    size: MantineSize;
  };
}

export const defaultStyles: IStyles = {
  size: 'sm',
  spacing: 'md',
  button: {
    size: 'xs',
  },
};
