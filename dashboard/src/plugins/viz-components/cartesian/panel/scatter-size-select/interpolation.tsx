import { Box, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { toJS } from 'mobx';
import { TScatterSize } from './types';

interface IInterpolationScatterSizeField {
  value: TScatterSize;
  onChange: (v: TScatterSize) => void;
}
export const InterpolationScatterSizeField = ({ value, onChange }: IInterpolationScatterSizeField) => {
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const [localValue, setLocalValue] = useState(value);

  if (value.type !== 'interpolation') {
    return null;
  }

  const handleOk = () => {
    setFalse();
    onChange(toJS(localValue));
  };

  const handleCancel = () => {
    setFalse();
    setLocalValue(value);
  };

  return (
    <>
      <Box sx={{ width: '50%' }}>
        <Button variant="filled" mt={24} onClick={setTrue} sx={{ flexGrow: 0 }}>
          Setup
        </Button>
      </Box>
      <Modal size={508} title="Setup size interpolation" opened={modalOpened} onClose={setFalse}>
        {modalOpened && (
          <Stack>
            <Text>TODO</Text>
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
