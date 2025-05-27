import { Badge } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardFilterType, TDashboardStateItem } from '~/model';
import { ItemBadge } from './item-badge';

type Props = {
  item: TDashboardStateItem;
};

export const DateRangeState = observer(({ item }: Props) => {
  if (item.type !== DashboardFilterType.DateRange) {
    return null;
  }
  const value = item.value.join(' ~ ');
  return <ItemBadge label={item.label} value={value} />;
});
