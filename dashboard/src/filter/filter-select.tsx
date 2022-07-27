import { Select } from "@mantine/core";
import { IDashboardFilter, IFilterConfig_Select } from "../types";

interface IFilterSelect extends Omit<IDashboardFilter, 'type' | 'config'> {
  config: IFilterConfig_Select;
}

export function FilterSelect({ name, config }: IFilterSelect) {
  return (
    <Select
      label={name}
      data={config.static_options}
    />
  )
}