import { Button, Flex, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { MericoLinearGaugeSection } from '../../type';

type AddARowProps = {
  append: (v: MericoLinearGaugeSection) => void;
};

export const AddARow = ({ append }: AddARowProps) => {
  const { t } = useTranslation();

  const add = () => {
    append({ name: '', color: '', minKey: '' });
  };
  return (
    <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="nowrap">
      <div style={{ minWidth: '30px', maxWidth: '30px', flex: 0 }} />
      <Group wrap="nowrap" style={{ flex: 1 }}>
        <Button size="xs" variant="subtle" onClick={add} leftSection={<IconPlus size={14} />}>
          {t('viz.merico_linear_gauge.sections.add')}
        </Button>
      </Group>
      <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }} />
    </Flex>
  );
};
