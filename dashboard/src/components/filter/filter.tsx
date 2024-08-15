import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  DashboardFilterType,
  FilterDateRangeConfigInstance,
  FilterMetaInstance,
  FilterMultiSelectConfigInstance,
  FilterSelectConfigInstance,
  FilterTextInputConfigInstance,
  FilterTreeSelectConfigInstance,
} from '~/model';
import { FilterCheckboxConfigInstance } from '../../model/meta-model/dashboard/content/filter/widgets/checkbox';
import { ErrorBoundary } from '../../utils/error-boundary';
import { FilterCheckbox } from './filter-checkbox/render';
import { FilterDateRange } from './filter-date-range/render';
import { FilterMultiSelect } from './filter-multi-select/render';
import { FilterSelect } from './filter-select/render';
import { FilterTextInput } from './filter-text-input/render';
import { FilterTreeSelect } from './filter-tree';

interface IFilter {
  filter: FilterMetaInstance;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

const RenderFilter = observer(
  ({
    filter: { type, config, key, ...rest },
    formFieldProps,
  }: {
    filter: FilterMetaInstance;
    formFieldProps: Omit<IFilter, 'filter'>;
  }) => {
    switch (type) {
      case DashboardFilterType.Select:
        return <FilterSelect {...rest} {...formFieldProps} config={config as FilterSelectConfigInstance} />;
      case DashboardFilterType.MultiSelect:
        return <FilterMultiSelect {...rest} {...formFieldProps} config={config as FilterMultiSelectConfigInstance} />;
      case DashboardFilterType.TreeSelect:
        return <FilterTreeSelect {...rest} {...formFieldProps} config={config as FilterTreeSelectConfigInstance} />;
      case DashboardFilterType.TextInput:
        return <FilterTextInput {...rest} {...formFieldProps} config={config as FilterTextInputConfigInstance} />;
      case DashboardFilterType.DateRange:
        return <FilterDateRange {...rest} {...formFieldProps} config={config as FilterDateRangeConfigInstance} />;
      case DashboardFilterType.Checkbox:
        return <FilterCheckbox {...rest} {...formFieldProps} config={config as FilterCheckboxConfigInstance} />;
      default:
        return null;
    }
  },
);

export const Filter = observer(
  React.forwardRef(({ filter, ...formFieldProps }: IFilter, ref: $TSFixMe) => {
    return (
      <div className="filter-root" ref={ref}>
        <ErrorBoundary>
          <RenderFilter filter={filter} formFieldProps={formFieldProps} />
        </ErrorBoundary>
      </div>
    );
  }),
);
