import { MantineSize } from "@mantine/core";

export interface IStyles {
  size: MantineSize;
  spacing: MantineSize;
}

export const defaultStyles: IStyles = {
  size: 'sm',
  spacing: 'md'
}