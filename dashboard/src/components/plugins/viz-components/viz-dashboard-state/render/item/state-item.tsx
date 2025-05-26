import { Badge } from '@mantine/core';
import { TDashboardStateItem } from '~/model';

type Props = {
  item: TDashboardStateItem;
};

export const StateItem = ({ item }: Props) => {
  return (
    <Badge key={item.key} variant="default" color="blue" radius="xs">
      {item.string}
    </Badge>
  );
};
