import { useSortable } from '@dnd-kit/react/sortable';
import { ActionIcon, Autocomplete, Badge, Center, CloseButton, ColorInput, Flex, Group } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { NameColorMapRow } from './types';

type RowFieldItem = {
  id: string;
} & NameColorMapRow;

type NameColorMapRowProps = {
  row: RowFieldItem;
  handleChange: (v: RowFieldItem) => void;
  handleRemove: () => void;
  index: number;
  names: string[];
};

export const RowEditor = ({ row, index, handleChange, handleRemove, names }: NameColorMapRowProps) => {
  const { t } = useTranslation();
  const [touched, { setTrue: setTouched }] = useBoolean(false);
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

  const changeColor = (color: string) => {
    handleChange({
      ...row,
      color,
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
        <Autocomplete
          size="xs"
          value={row.name}
          placeholder={t('viz.pie_chart.color.map.name')}
          onChange={changeName}
          onClick={setTouched}
          error={touched && !row.name}
          data={names}
          maxDropdownHeight={500}
        />
        <ColorInput
          styles={{
            root: {
              flexGrow: 1,
            },
          }}
          popoverProps={{
            withinPortal: true,
            zIndex: 340,
          }}
          size="xs"
          value={row.color}
          onChange={changeColor}
          onClick={setTouched}
          error={touched && !row.color}
        />
      </Group>
      <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }}>
        <CloseButton onClick={handleRemove} size="sm" />
      </div>
    </Flex>
  );
};
