import { Divider, Group, Text } from '@mantine/core';
import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InfoCircle } from 'tabler-icons-react';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { ISunburstConf, ISunburstLevelConf } from '../../type';
import { LevelField } from './level';

interface ILevelsField {
  control: Control<ISunburstConf, $TSFixMe>;
  watch: UseFormWatch<ISunburstConf>;
}

export const LevelsField = ({ control, watch }: ILevelsField) => {
  const { t } = useTranslation();

  const getItem = () => {
    const item: ISunburstLevelConf = {
      id: Date.now().toString(),
      r0: '',
      r: '',
      label: {
        show_label_tolerance: 0.001,
        rotate: '0',
        align: 'center',
        position: 'inside',
        padding: 0,
      },
    };
    return item;
  };

  const renderTabName = (field: ISunburstLevelConf, index: number) => {
    return index + 1;
  };

  return (
    <>
      <Group spacing={2} sx={{ cursor: 'default', userSelect: 'none' }}>
        <InfoCircle size={14} color="#888" />
        <Text size={14} color="#888">
          {t('viz.sunburst_chart.level.hint')}
        </Text>
      </Group>
      <Divider variant="dashed" my={10} />
      <FieldArrayTabs<ISunburstConf, ISunburstLevelConf>
        control={control}
        watch={watch}
        name="levels"
        getItem={getItem}
        addButtonText={t('viz.sunburst_chart.level.add')}
        deleteButtonText={t('viz.sunburst_chart.level.delete')}
        renderTabName={renderTabName}
      >
        {({ field, index }) => <LevelField control={control} index={index} />}
      </FieldArrayTabs>
    </>
  );
};
