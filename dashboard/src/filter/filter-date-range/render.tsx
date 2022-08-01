import { DateRangePicker } from "@mantine/dates";
import { IDashboardFilter, IFilterConfig_DateRange } from "../../types";

interface IFilterDateRange extends Omit<IDashboardFilter, 'type' | 'config'> {
  config: IFilterConfig_DateRange;
  value: any;
  onChange: (v: any) => void;
}

export function FilterDateRange({ label, config, value, onChange }: IFilterDateRange) {
  return (
    <DateRangePicker
      label={label}
      value={value}
      onChange={onChange}
      sx={{ minWidth: '14em' }}
      {...config}
    />
  )
}