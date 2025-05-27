import { DashboardFilterType, TDashboardStateItem } from '~/model';
import { CheckboxState } from './checkbox-state';
import { ContextState } from './context-state';
import { DateRangeState } from './date-range-state';
import { MultiSelectState } from './multi-select-state';
import { SingleSelectState } from './single-select-state';
import { TextInputState } from './text-input-state';
import { TreeSelectState } from './tree-select-state';
import { TreeSingleSelectState } from './tree-single-select-state';

type Props = {
  item: TDashboardStateItem;
};

export const StateItem = ({ item }: Props) => {
  switch (item.type) {
    case DashboardFilterType.DateRange:
      return <DateRangeState item={item} />;
    case DashboardFilterType.Select:
      return <SingleSelectState item={item} />;
    case DashboardFilterType.TreeSingleSelect:
      return <TreeSingleSelectState item={item} />;
    case DashboardFilterType.MultiSelect:
      return <MultiSelectState item={item} />;
    case DashboardFilterType.TreeSelect:
      return <TreeSelectState item={item} />;
    case DashboardFilterType.TextInput:
      return <TextInputState item={item} />;
    case DashboardFilterType.Checkbox:
      return <CheckboxState item={item} />;
    case 'context':
      return <ContextState item={item} />;
    default:
      return null;
  }
};
