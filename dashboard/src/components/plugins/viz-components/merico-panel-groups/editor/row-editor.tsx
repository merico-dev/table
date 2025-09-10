import { useSortable } from '@dnd-kit/react/sortable';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  CloseButton,
  ComboboxData,
  Flex,
  Group,
  MultiSelect,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { MericoPanelGroupItem } from '../type';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext } from '~/contexts';
import { useMemo } from 'react';

type RowFieldItem = {
  id: string;
} & MericoPanelGroupItem;

type Props = {
  row: RowFieldItem;
  handleChange: (v: RowFieldItem) => void;
  handleRemove: () => void;
  index: number;
  panelOptions: ComboboxData;
};

export const RowEditor = ({ row, index, handleChange, handleRemove, panelOptions }: Props) => {
  const { t } = useTranslation();
  const [touched, { setTrue: setTouched }] = useBoolean(false);

  const changeName = (name: string) => {
    handleChange({
      ...row,
      name,
    });
  };

  const changeComment = (comment: string) => {
    handleChange({
      ...row,
      comment,
    });
  };

  const changePanelIDs = (panelIDs: string[]) => {
    handleChange({
      ...row,
      panelIDs,
    });
  };

  return (
    <Stack gap="xs" p="xs" style={{ border: '1px solid var(--mantine-color-gray-4)', borderRadius: '2px' }}>
      <Group grow wrap="nowrap" style={{ flex: 1 }}>
        <TextInput
          size="xs"
          value={row.name}
          placeholder={t('viz.merico_panel_groups.groups.name')}
          onChange={(e) => changeName(e.currentTarget.value)}
          onClick={setTouched}
          error={touched && !row.name}
        />
        <TextInput
          size="xs"
          value={row.comment}
          placeholder={t('viz.merico_panel_groups.groups.comment')}
          onChange={(e) => changeComment(e.currentTarget.value)}
        />
      </Group>
      <MultiSelect
        label=""
        placeholder={t('viz.merico_panel_groups.groups.panel_ids')}
        onChange={changePanelIDs}
        value={row.panelIDs}
        clearable
        size="xs"
        data={panelOptions}
        maxDropdownHeight={500}
        comboboxProps={{ width: 300, position: 'bottom-start' }}
      />
      <Button
        variant="subtle"
        color="red"
        size="xs"
        ml="auto"
        mt="md"
        leftSection={<IconTrash size={14} />}
        onClick={handleRemove}
      >
        删除这一组
      </Button>
    </Stack>
  );
};
