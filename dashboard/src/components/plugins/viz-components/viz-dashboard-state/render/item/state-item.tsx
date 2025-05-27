import { Badge } from '@mantine/core';
import { DashboardFilterType, TDashboardStateItem } from '~/model';
import { DateRangeState } from './date-range-state';
import { SingleSelectState } from './single-select-state';
import { TreeSingleSelectState } from './tree-single-select-state';
import { MultiSelectState } from './multi-select-state';

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
    default:
      return (
        <Badge variant="default" color="blue" radius="xs">
          {item.value}
        </Badge>
      );
  }
};
