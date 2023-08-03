import { observer } from 'mobx-react-lite';
import React from 'react';
import {
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
import { FilterTreeSelect } from './filter-tree-select/render';

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
      case 'select':
        return <FilterSelect {...rest} {...formFieldProps} config={config as FilterSelectConfigInstance} />;
      case 'multi-select':
        return <FilterMultiSelect {...rest} {...formFieldProps} config={config as FilterMultiSelectConfigInstance} />;
      case 'tree-select':
        return <FilterTreeSelect {...rest} {...formFieldProps} config={config as FilterTreeSelectConfigInstance} />;
      case 'text-input':
        return <FilterTextInput {...rest} {...formFieldProps} config={config as FilterTextInputConfigInstance} />;
      case 'date-range':
        return <FilterDateRange {...rest} {...formFieldProps} config={config as FilterDateRangeConfigInstance} />;
      case 'checkbox':
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
