import { Button, Group, Modal, Select, SelectItem, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { IColorManager } from '~/plugins';

import { ColorMappingEditor } from '~/plugins/controls/color-mapping-editor';
import { IColorInterpolationConfig, IValueStep } from '~/types/plugin';

export interface IColorInterpolationSelectProps {
  colorManager: IColorManager;
  value: IColorInterpolationConfig;
  onChange?: (value: IColorInterpolationConfig) => void;
}

export const ColorInterpolationSelect = (props: IColorInterpolationSelectProps) => {
  const { value, onChange, colorManager } = props;
  const interpolations = colorManager.getColorInterpolations();
  const [localValue, setLocalValue] = useState(value);
  const interpolation = colorManager.decodeInterpolation(localValue.interpolation) || interpolations[0];
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const selectData: SelectItem[] = interpolations.map((it) => ({
    label: it.displayName,
    value: colorManager.encodeColor(it),
    group: it.category,
  }));

  function handleStyleChange(item: string | null) {
    if (item) {
      setLocalValue((prev) => ({ ...prev, interpolation: item }));
    }
  }

  const handleOk = () => {
    setFalse();
    onChange?.(localValue);
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
      <Button onClick={setTrue}>{interpolation?.displayName}</Button>
      <Modal size={508} title="Setup color interpolation" opened={modalOpened} onClose={setFalse}>
        {modalOpened && (
          <Stack data-testid="color-interpolation-modal">
            <Select
              label="Color style"
              value={localValue.interpolation}
              data={selectData}
              onChange={handleStyleChange}
            />
            <ColorMappingEditor steps={localValue.steps} interpolation={interpolation} onChange={handleStepsChange} />
            <Group position="right">
              <Button onClick={handleCancel} variant="subtle">
                Cancel
              </Button>
              <Button onClick={handleOk}>OK</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};
