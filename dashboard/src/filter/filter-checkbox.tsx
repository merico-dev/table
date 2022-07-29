import { Checkbox } from "@mantine/core";
import { IDashboardFilter, IFilterConfig_Checkbox } from "../types";

interface IFilterCheckbox extends Omit<IDashboardFilter, 'type' | 'config'> {
  config: IFilterConfig_Checkbox;
  value: any;
  onChange: (v: any) => void;
}

export function FilterCheckbox({ label, config, value, onChange }: IFilterCheckbox) {
  return (
    <Checkbox
      label={label}
      checked={value}
      onChange={(event) => onChange(event.currentTarget.checked)}
      {...config}
    />
  )
}