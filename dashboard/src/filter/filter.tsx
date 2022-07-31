import { ErrorBoundary } from "../panel/error-boundary";
import { IDashboardFilter, IFilterConfig_Checkbox, IFilterConfig_DateTime, IFilterConfig_Select, IFilterConfig_TextInput } from "../types";
import { FilterCheckbox } from "./filter-checkbox/render";
import { FilterDateTime } from "./filter-date-time/render";
import { FilterSelect } from "./filter-select/render";
import { FilterTextInput } from "./filter-text-input/render";

interface IFilter {
  filter: IDashboardFilter;
  value: any;
  onChange: (v: any) => void;
}

function renderFilter({ type, config, ...rest }: IDashboardFilter, formFieldProps: Omit<IFilter, 'filter'>) {
  switch (type) {
    case 'select': return <FilterSelect {...rest} {...formFieldProps} config={config as IFilterConfig_Select} />;
    case 'text-input': return <FilterTextInput {...rest} {...formFieldProps} config={config as IFilterConfig_TextInput} />;
    case 'date-time': return <FilterDateTime {...rest} {...formFieldProps} config={config as IFilterConfig_DateTime} />;
    case 'checkbox': return <FilterCheckbox {...rest} {...formFieldProps} config={config as IFilterConfig_Checkbox} />;
    default: return null;
  }
}

export function Filter({ filter, ...formFieldProps }: IFilter) {
  return (
    <div className="filter-root">
      <ErrorBoundary>
        {renderFilter(filter, formFieldProps)}
      </ErrorBoundary>
    </div>
  )
}