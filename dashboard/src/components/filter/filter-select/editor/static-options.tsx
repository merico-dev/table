import { ActionIcon, Button, Flex, Group, Select, TextInput } from '@mantine/core';
import { IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterSelectConfigInstance } from '~/model';
import { PresetOptionSeries } from './preset-option-series';

type Props = {
  config: FilterSelectConfigInstance;
};

const AddOrUsePreset = observer(({ config }: Props) => {
  const { t, i18n } = useTranslation();
  const addStaticOption = () => {
    config.addStaticOption({
      label: '',
      value: '',
    });
  };

  const presetOptionSeries = useMemo(
    () => [
      {
        label: t('filter.widget.select.preset_options.date_unit'),
        value: 'date_unit',
      },
    ],
    [i18n.language],
  );

  const applyPresetOptions = (v: string | null) => {
    if (!v || !(v in PresetOptionSeries)) {
      return;
    }
    const options = PresetOptionSeries[v][i18n.language];
    config.replaceStaticOptions(options);
    if (options.length > 0) {
      config.setDefaultValue(options[0].value);
    }
  };

  return (
    <Group justify="space-between">
      <Button size="xs" color="blue" leftSection={<IconPlaylistAdd size={20} />} onClick={addStaticOption}>
        {t('common.actions.add_an_option')}
      </Button>

      <Select
        placeholder={t('filter.widget.select.preset_options.apply')}
        value={null}
        onChange={applyPresetOptions}
        data={presetOptionSeries}
        size="xs"
      />
    </Group>
  );
});

export const StaticOptions = observer(({ config }: Props) => {
  const { t, i18n } = useTranslation();
  const staticOptionFields = [...config.static_options];
  const optionsForDefaultValue = useMemo(() => {
    return [
      { label: t('filter.widget.select.no_default_selection'), value: '' },
      ...staticOptionFields.filter((o) => o.value !== ''),
    ];
  }, [i18n.language, staticOptionFields]);

  if (staticOptionFields.length === 0) {
    return <AddOrUsePreset config={config} />;
  }

  return (
    <>
      <Select
        label={t('filter.widget.select.default_selection')}
        data={optionsForDefaultValue}
        value={config.default_value}
        onChange={config.setDefaultValue}
      />
      {staticOptionFields.map((_optionField, optionIndex) => (
        <Flex gap={10} key={optionIndex} sx={{ position: 'relative' }} pr="40px">
          <TextInput
            label={t('common.label')}
            required
            value={config.static_options[optionIndex].label}
            onChange={(e) => {
              config.static_options[optionIndex].setLabel(e.currentTarget.value);
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextInput
            label={t('common.value')}
            required
            value={config.static_options[optionIndex].value}
            onChange={(e) => {
              config.static_options[optionIndex].setValue(e.currentTarget.value);
            }}
            sx={{ flexGrow: 1 }}
          />
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => config.removeStaticOption(optionIndex)}
            sx={{ position: 'absolute', top: 28, right: 5 }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Flex>
      ))}
      <AddOrUsePreset config={config} />
    </>
  );
});
