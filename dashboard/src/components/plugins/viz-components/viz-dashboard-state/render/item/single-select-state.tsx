import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DashboardFilterType,
  FilterSelectConfigInstance,
  TDashboardStateItem,
  TDashboardStateItem_Filter,
} from '~/model';
import { ItemBadge } from './item-badge';

type Props = {
  item: TDashboardStateItem_Filter;
};
const _SingleSelectState = observer(({ item }: Props) => {
  const { t } = useTranslation();
  const model = item.model;
  const config = model.config as FilterSelectConfigInstance;
  const labelOfSelection = useMemo(() => {
    return config.options.find((o) => o.value === item.value)?.label ?? item.value;
  }, [item.value, config.options]);

  return (
    <ItemBadge
      label={item.label}
      value={labelOfSelection}
      label_description={item.key}
      value_description={item.value}
    />
  );
});

export const SingleSelectState = ({ item }: { item: TDashboardStateItem }) => {
  if (item.type !== DashboardFilterType.Select) {
    return null;
  }

  return <_SingleSelectState item={item} />;
};
