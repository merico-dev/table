import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { PanelContext } from '../../../contexts/panel-context';

export function EditTitle() {
  const { title, setTitle } = React.useContext(PanelContext);
  const [localTitle, setLocalTitle] = useInputState(title);

  const changed = title !== localTitle;

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    setTitle(localTitle);
  }, [changed, localTitle]);

  return (
    <TextInput
      value={localTitle}
      onChange={setLocalTitle}
      label={
        <Group align="end">
          <Text>Panel Title</Text>
          <ActionIcon variant="subtle" color="blue" disabled={!changed} onClick={submit}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
      }
    />
  );
}
