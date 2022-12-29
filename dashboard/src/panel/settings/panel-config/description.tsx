import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { usePanelContext } from '../../../contexts/panel-context';
import { CustomRichTextEditor } from '../common/custom-rich-text-editor';

export const EditDescription = observer(() => {
  const { panel } = usePanelContext();
  const [value, onChange] = React.useState(panel.description);

  const changed = panel.description !== value;

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    panel.setDescription(value);
  }, [changed, value]);

  return (
    <Stack spacing={4} sx={{ flexGrow: 1 }}>
      <Group align="end">
        <Text sx={{ flexGrow: 1 }}>Description</Text>
        <ActionIcon variant="subtle" color="blue" disabled={!changed} onClick={submit}>
          <DeviceFloppy size={20} />
        </ActionIcon>
      </Group>
      <CustomRichTextEditor value={value} onChange={onChange} styles={{ root: { flexGrow: 1 } }} />
    </Stack>
  );
});
