import { useSortable } from '@dnd-kit/react/sortable';
import { ActionIcon, Badge, Center, CloseButton, Flex, Group, MultiSelect, TextInput } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { MericoPanelGroupItem } from '../type';

type RowFieldItem = {
  id: string;
} & MericoPanelGroupItem;

type Props = {
  row: RowFieldItem;
  handleChange: (v: RowFieldItem) => void;
  handleRemove: () => void;
  index: number;
  data: TPanelData;
};
export const RowEditor = ({ row, index, handleChange, handleRemove, data }: Props) => {
  const { t } = useTranslation();
  const [nameTouched, { setTrue: setNameTouched }] = useBoolean(false);
  const [commentTouched, { setTrue: setCommentTouched }] = useBoolean(false);
  const [hovering, { setTrue, setFalse }] = useBoolean(false);
  const { ref, handleRef } = useSortable({
    id: row.id,
    index,
  });

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
    <Flex
      ref={ref}
      gap="sm"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="nowrap"
      onMouseEnter={setTrue}
      onMouseLeave={setFalse}
    >
      <Center style={{ minWidth: '30px', maxWidth: '30px', flex: 0 }}>
        {hovering ? (
          <ActionIcon size="xs" ref={handleRef} variant="subtle">
            <IconGripVertical />
          </ActionIcon>
        ) : (
          <Badge size="sm" variant="light">
            {index + 1}
          </Badge>
        )}
      </Center>
      <Group grow wrap="nowrap" style={{ flex: 1 }}>
        <TextInput
          size="xs"
          value={row.name}
          placeholder={t('viz.merico_panel_groups.groups.name')}
          onChange={(e) => changeName(e.currentTarget.value)}
          onClick={setNameTouched}
          error={nameTouched && !row.name}
        />
        <TextInput
          size="xs"
          value={row.comment}
          placeholder={t('viz.merico_panel_groups.groups.comment')}
          onChange={(e) => changeComment(e.currentTarget.value)}
          onClick={setCommentTouched}
          error={commentTouched && !row.comment}
        />
        <MultiSelect
          label=""
          placeholder={t('viz.merico_panel_groups.groups.panel_ids')}
          onChange={changePanelIDs}
          value={row.panelIDs}
          clearable
          size="xs"
        />
      </Group>
      <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }}>
        <CloseButton onClick={handleRemove} size="sm" />
      </div>
    </Flex>
  );
};
