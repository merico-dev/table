import { Button, Group, Modal, Select, SelectItem, Stack } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { toJS } from 'mobx';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IColorManager } from '~/components/plugins';

import { IColorInterpolationConfig, IValueStep } from '~/types/plugin';
import { ColorMappingEditor } from '../color-mapping-editor';

export interface IColorInterpolationSelectProps {
  colorManager: IColorManager;
  value: IColorInterpolationConfig;
  onChange?: (value: IColorInterpolationConfig) => void;
}

export const ColorInterpolationSelect = (props: IColorInterpolationSelectProps) => {
  const { t, i18n } = useTranslation();
  const { value, onChange, colorManager } = props;
  const interpolations = colorManager.getColorInterpolations();
  const [localValue, setLocalValue] = useState(value);
  const interpolation = colorManager.decodeInterpolation(localValue.interpolation) || interpolations[0];
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const selectData: SelectItem[] = useMemo(() => {
    return interpolations.map((it) => ({
      label: t(it.displayName),
      value: colorManager.encodeColor(it),
      group: t(`style.color.interpolation.palette.category.${it.category}`),
    }));
  }, [i18n.language]);

  function handleStyleChange(item: string | null) {
    if (item) {
      setLocalValue((prev) => ({ ...prev, interpolation: item }));
    }
  }

  const handleOk = () => {
    setFalse();
    onChange?.(toJS(localValue));
  };

  function handleStepsChange(steps: IValueStep[]) {
    setLocalValue((prev) => ({ ...prev, steps }));
  }

  const handleCancel = () => {
    setFalse();
    setLocalValue(value);
  };
  return (
    <>
      <Button variant="outline" onClick={setTrue}>
        {t(interpolation?.displayName)}
      </Button>
      <Modal
        size={508}
        title={t('style.color.interpolation.setup')}
        opened={modalOpened}
        onClose={setFalse}
        zIndex={320}
      >
        {modalOpened && (
          <Stack data-testid="color-interpolation-modal">
            <Select
              label={t('style.color.interpolation.palette.label')}
              value={localValue.interpolation}
              data={selectData}
              onChange={handleStyleChange}
              withinPortal
              zIndex={340}
              maxDropdownHeight={500}
            />
            <ColorMappingEditor steps={localValue.steps} interpolation={interpolation} onChange={handleStepsChange} />
            <Group position="apart">
              <Button onClick={handleCancel} variant="subtle">
                {t('common.actions.cancel')}
              </Button>
              <Button color="green" leftIcon={<IconDeviceFloppy size={16} />} onClick={handleOk}>
                {t('common.actions.save')}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};
