import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardFilterType, TDashboardStateItem, TDashboardStateItem_Filter } from '~/model';
import { ItemBadge } from './item-badge';

type Props = {
  item: TDashboardStateItem_Filter;
};
const _DateRangeState = observer(({ item }: Props) => {
  const { t } = useTranslation();
  const model = item.model;

  const valueWithShortcut = model.value;
  const [begin, end] = valueWithShortcut.value;
  const count = useMemo(() => {
    if (!end && !begin) {
      return Number.NaN;
    }
    return dayjs(end).diff(dayjs(begin), 'days') + 1;
  }, [begin, end]);

  if (Number.isNaN(count)) {
    return <span style={{ userSelect: 'none', opacity: 0, visibility: 'hidden' }}>.</span>;
  }

  const label = count === 1 ? t('filter.widget.date_range.one_day') : t('filter.widget.date_range.x_days', { count });

  return <ItemBadge label={item.label} value={item.value.join(' ~ ')} label_tooltip={item.key} value_tooltip={label} />;
});

export const DateRangeState = ({ item }: { item: TDashboardStateItem }) => {
  if (item.type !== DashboardFilterType.DateRange) {
    return null;
  }

  return <_DateRangeState item={item} />;
};
