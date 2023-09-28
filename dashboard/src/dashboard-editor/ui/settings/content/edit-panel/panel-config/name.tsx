import { ActionIcon, Group, Stack, Text, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useEditPanelContext } from '~/contexts/panel-context';

const RequiredMark = () => (
  <span className="mantine-103svbs mantine-InputWrapper-required mantine-Select-required" aria-hidden="true">
    {' '}
    *
  </span>
);

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

  const empty = !local.trim();

  return (
    <Stack spacing={4}>
      <Group align="center">
        <Text size={14} fw={500}>
          Panel Name
          <RequiredMark />
        </Text>
        <ActionIcon variant="subtle" color="blue" disabled={!changed || empty} onClick={submit}>
          <IconDeviceFloppy size={18} />
        </ActionIcon>
      </Group>
      <TextInput value={local} onChange={setLocal} required />
    </Stack>
  );
});
