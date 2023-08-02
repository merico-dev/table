import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { useEditPanelContext } from '~/contexts/panel-context';

export const EditTitle = observer(() => {
  const { panel } = useEditPanelContext();
  const { title, setTitle } = panel;
  const [localTitle, setLocalTitle] = useInputState(title);

  const changed = title !== localTitle;

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    setTitle(localTitle);
  }, [changed, localTitle]);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  return (
    <TextInput
      value={localTitle}
      onChange={setLocalTitle}
      label={
        <Group>
          <Text>Panel Title</Text>
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
