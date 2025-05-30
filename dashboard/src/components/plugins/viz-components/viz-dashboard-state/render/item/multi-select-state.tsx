import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterMultiSelectConfigInstance, TDashboardStateItem, TDashboardStateItem_Filter } from '~/model';
import { ItemBadge } from './item-badge';
import { SelectionTable } from './selection-table';

type Props = {
  item: TDashboardStateItem_Filter;
};
const _MultiSelectState = observer(({ item }: Props) => {
  const { t } = useTranslation();
  const model = item.model;
  const config = model.config as FilterMultiSelectConfigInstance;
  const selection = useMemo(() => {
    return config.optionsByValues(item.value);
  }, [item.value, config.options]);

  return (
    <ItemBadge
      label={item.label}
      value={selection.length}
      label_description={`filters.${item.key}`}
      value_description={<SelectionTable selection={selection} />}
    />
  );
});

export const MultiSelectState = ({ item }: { item: TDashboardStateItem }) => {
  if (item.type !== 'multi-select') {
    return null;
  }

  return <_MultiSelectState item={item} />;
};
