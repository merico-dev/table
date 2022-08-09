import React from 'react';
import { FilterModelInstance } from '../model';
import { IFilterConfig_Checkbox } from '../model/filter/checkbox';
import { IFilterConfig_DateRange } from '../model/filter/date-range';
import { IFilterConfig_MultiSelect } from '../model/filter/multi-select';
import { IFilterConfig_Select } from '../model/filter/select';
import { IFilterConfig_TextInput } from '../model/filter/text-input';
import { ErrorBoundary } from '../panel/error-boundary';
import { FilterCheckbox } from './filter-checkbox/render';
import { FilterDateRange } from './filter-date-range/render';
import { FilterMultiSelect } from './filter-multi-select/render';
import { FilterSelect } from './filter-select/render';
import { FilterTextInput } from './filter-text-input/render';

interface IFilter {
  filter: FilterModelInstance;
  value: any;
  onChange: (v: any) => void;
}

function renderFilter({ type, config, ...rest }: FilterModelInstance, formFieldProps: Omit<IFilter, 'filter'>) {
  switch (type) {
    case 'select':
      return <FilterSelect {...rest} {...formFieldProps} config={config as IFilterConfig_Select} />;
    case 'multi-select':
      return <FilterMultiSelect {...rest} {...formFieldProps} config={config as IFilterConfig_MultiSelect} />;
    case 'text-input':
      return <FilterTextInput {...rest} {...formFieldProps} config={config as IFilterConfig_TextInput} />;
    case 'date-range':
      return <FilterDateRange {...rest} {...formFieldProps} config={config as IFilterConfig_DateRange} />;
    case 'checkbox':
      return <FilterCheckbox {...rest} {...formFieldProps} config={config as IFilterConfig_Checkbox} />;
    default:
      return null;
  }
}

export const Filter = React.forwardRef(function _Filter({ filter, ...formFieldProps }: IFilter, ref: any) {
  return (
    <div className="filter-root" ref={ref}>
      <ErrorBoundary>{renderFilter(filter, formFieldProps)}</ErrorBoundary>
    </div>
  );
});
