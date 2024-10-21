import { ComboboxItem } from '@mantine/core';

type SelectChangeHandler<T> = (v: T, option: ComboboxItem) => void;
export const getSelectChangeHandler = <T = string>(func: SelectChangeHandler<T>) => {
  return (v: string | null, option: ComboboxItem) => {
    v !== null && func(v as T, option);
  };
};
