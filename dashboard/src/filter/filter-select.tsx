import { Select } from "@mantine/core";
import { IDashboardFilter, IFilterConfig_Select } from "../types";

interface IFilterSelect extends Omit<IDashboardFilter, 'type' | 'config'> {
  config: IFilterConfig_Select;
  value: any;
  onChange: (v: any) => void;
}

export function FilterSelect({ label, config, value, onChange }: IFilterSelect) {
  return (
    <Select
      label={label}
      data={config.static_options}
      value={value}
      onChange={onChange}
    />
  )
}