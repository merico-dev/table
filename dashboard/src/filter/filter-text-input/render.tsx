import { TextInput } from "@mantine/core";
import { IDashboardFilter, IFilterConfig_TextInput } from "../../types";

interface IFilterTextInput extends Omit<IDashboardFilter, 'type' | 'config'> {
  config: IFilterConfig_TextInput;
  value: any;
  onChange: (v: any) => void;
}

export function FilterTextInput({ label, config, value, onChange }: IFilterTextInput) {
  return (
    <TextInput
      label={label}
      value={value}
      onChange={onChange}
      {...config}
    />
  )
}