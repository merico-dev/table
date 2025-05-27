import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DashboardFilterType,
  FilterTreeSelectConfigInstance,
  TDashboardStateItem,
  TDashboardStateItem_Filter,
} from '~/model';
import { ItemBadge } from './item-badge';
import { SelectionTable } from './selection-table';

type Props = {
  item: TDashboardStateItem_Filter;
};
const _TreeSelectState = observer(({ item }: Props) => {
  const { t } = useTranslation();
  const model = item.model;
  const config = model.config as FilterTreeSelectConfigInstance;
  const selection = useMemo(() => {
    return config.optionsByValues(item.value);
  }, [item.value, config.options]);

  return (
    <ItemBadge
      label={item.label}
      value={selection.length}
      label_description={item.key}
      value_description={<SelectionTable selection={selection} />}
    />
  );
});

export const TreeSelectState = ({ item }: { item: TDashboardStateItem }) => {
  if (item.type !== DashboardFilterType.TreeSelect) {
    return null;
  }

  return <_TreeSelectState item={item} />;
};
