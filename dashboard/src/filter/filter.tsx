import React from 'react';
import { FilterModelInstance } from '../model';
import { IFilterConfig_Checkbox } from '../model/filters/filter/checkbox';
import { IFilterConfig_DateRange } from '../model/filters/filter/date-range';
import { IFilterConfig_MultiSelect } from '../model/filters/filter/multi-select';
import { IFilterConfig_Select } from '../model/filters/filter/select';
import { IFilterConfig_TextInput } from '../model/filters/filter/text-input';
import { ErrorBoundary } from '../panel/error-boundary';
import { FilterCheckbox } from './filter-checkbox/render';
import { FilterDateRange } from './filter-date-range/render';
import { FilterMultiSelect } from './filter-multi-select/render';
import { FilterSelect } from './filter-select/render';
import { FilterTextInput } from './filter-text-input/render';

interface IFilter {
  filter: FilterModelInstance;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderFilter({ type, config, key, ...rest }: FilterModelInstance, formFieldProps: Omit<IFilter, 'filter'>) {
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

export const Filter = React.forwardRef(function _Filter({ filter, ...formFieldProps }: IFilter, ref: $TSFixMe) {
  return (
    <div className="filter-root" ref={ref}>
      <ErrorBoundary>{renderFilter(filter, formFieldProps)}</ErrorBoundary>
    </div>
  );
});
