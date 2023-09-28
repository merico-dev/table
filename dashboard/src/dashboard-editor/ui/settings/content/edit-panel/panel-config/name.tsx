import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { useEditPanelContext } from '~/contexts/panel-context';

export const EditName = observer(() => {
  const { panel } = useEditPanelContext();
  const { name } = panel;
  const [local, setLocal] = useInputState(name);

  const changed = name !== local;

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    panel.setName(local);
  }, [changed, local]);

  useEffect(() => {
    setLocal(name);
  }, [name]);

  return (
    <TextInput
      value={local}
      onChange={setLocal}
      label={
        <Group>
          <Text>Panel Name</Text>
          <ActionIcon variant="subtle" color="blue" disabled={!changed} onClick={submit}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
      }
      styles={{
        label: {
          display: 'block',
          paddingBottom: '4px',
        },
      }}
    />
  );
});
