import { Box } from "@mantine/core";
import { ErrorBoundary } from "../panel/error-boundary";
import { IDashboardFilter, IFilterConfig_Select } from "../types";
import { FilterSelect } from "./filter-select";


function renderFilter({ type, config, ...rest }: IDashboardFilter) {
  switch (type) {
    case 'select': return <FilterSelect {...rest} config={config as IFilterConfig_Select} />;
    default: return null;
  }
}

interface IFilter {
  filter: IDashboardFilter;
}

export function Filter({ filter }: IFilter) {
  return (
    <div className="filter-root">
      <ErrorBoundary>
        {renderFilter(filter)}
      </ErrorBoundary>
    </div>
  )
}