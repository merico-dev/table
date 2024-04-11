import { Badge, Divider, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const Hints = ({ max_days }: { max_days: number }) => {
  const { t } = useTranslation();
  if (!max_days) {
    return null;
  }
  return (
    <>
      <Group position="right">
        <Badge size="xs">{t('filter.widget.date_range.x_max_days', { max_days })}</Badge>
      </Group>
      <Divider variant="dashed" my={10} />
    </>
  );
};
