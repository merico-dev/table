import { Badge } from '@mantine/core';
import { DashboardFilterType, TDashboardStateItem } from '~/model';
import { DateRangeState } from './date-range-state';

type Props = {
  item: TDashboardStateItem;
};

export const StateItem = ({ item }: Props) => {
  switch (item.type) {
    case DashboardFilterType.DateRange:
      return <DateRangeState item={item} />;
    default:
      return (
        <Badge variant="default" color="blue" radius="xs">
          {item.string}
        </Badge>
      );
  }
};
