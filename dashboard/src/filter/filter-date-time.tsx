import { DateRangePicker } from "@mantine/dates";
import { IDashboardFilter, IFilterConfig_DateTime } from "../types";

interface IFilterDateTime extends Omit<IDashboardFilter, 'type' | 'config'> {
  config: IFilterConfig_DateTime;
  value: any;
  onChange: (v: any) => void;
}

export function FilterDateTime({ label, config, value, onChange }: IFilterDateTime) {
  return (
    <DateRangePicker
      label={label}
      value={value}
      onChange={onChange}
      {...config}
    />
  )
}