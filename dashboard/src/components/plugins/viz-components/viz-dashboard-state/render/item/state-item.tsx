import { TDashboardStateItem } from '~/model';
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
    case 'date-range':
      return <DateRangeState item={item} />;
    case 'select':
      return <SingleSelectState item={item} />;
    case 'tree-single-select':
      return <TreeSingleSelectState item={item} />;
    case 'multi-select':
      return <MultiSelectState item={item} />;
    case 'tree-select':
      return <TreeSelectState item={item} />;
    case 'text-input':
      return <TextInputState item={item} />;
    case 'checkbox':
      return <CheckboxState item={item} />;
    case 'context':
      return <ContextState item={item} />;
    default:
      return null;
  }
};
