import { Button, Flex, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { MericoPanelGroupItem } from '../type';

type AddARowProps = {
  append: (v: MericoPanelGroupItem) => void;
};

export const AddARow = ({ append }: AddARowProps) => {
  const { t } = useTranslation();

  const add = () => {
    append({ name: '', comment: '', panelIDs: [] });
  };
  return (
    <Flex gap="sm" justify="center" align="center" direction="row" wrap="nowrap">
      <Group wrap="nowrap" style={{ flex: 1 }}>
        <Button size="xs" variant="subtle" onClick={add} leftSection={<IconPlus size={14} />}>
          {t('viz.merico_panel_groups.groups.add')}
        </Button>
      </Group>
    </Flex>
  );
};
