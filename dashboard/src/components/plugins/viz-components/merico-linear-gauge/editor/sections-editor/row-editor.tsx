import { useSortable } from '@dnd-kit/react/sortable';
import { ActionIcon, Badge, Center, CloseButton, ColorInput, Flex, Group, TextInput } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { MericoLinearGaugeSection } from '../../type';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';

type RowFieldItem = {
  id: string;
} & MericoLinearGaugeSection;

type Props = {
  row: RowFieldItem;
  handleChange: (v: RowFieldItem) => void;
  handleRemove: () => void;
  index: number;
  data: TPanelData;
};
export const RowEditor = ({ row, index, handleChange, handleRemove, data }: Props) => {
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

  const changeMinKey = (minKey: string) => {
    handleChange({
      ...row,
      minKey,
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
        <TextInput
          size="xs"
          value={row.name}
          placeholder={t('viz.pie_chart.color.map.name')}
          onChange={(e) => changeName(e.currentTarget.value)}
          onClick={setTouched}
          error={touched && !row.name}
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
        <DataFieldSelector label="" placeholder="区间最小值" onChange={changeMinKey} value={row.minKey} />
      </Group>
      <div style={{ minWidth: '40px', maxWidth: '40px', flex: 0 }}>
        <CloseButton onClick={handleRemove} size="sm" />
      </div>
    </Flex>
  );
};
