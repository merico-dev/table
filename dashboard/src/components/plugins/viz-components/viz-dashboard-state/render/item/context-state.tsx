import { TDashboardStateItem } from '~/model';
import { ItemBadge } from './item-badge';

export const ContextState = ({ item }: { item: TDashboardStateItem }) => {
  if (item.type !== 'context') {
    return null;
  }

  return <ItemBadge label={item.key} value={item.value} label_description={`context.${item.key}`} />;
};
