import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { RichTextEditor } from '@mantine/rte';
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { PanelContext } from "../../../contexts/panel-context";

export function EditDescription() {
  const { description, setDescription } = React.useContext(PanelContext)
  const [value, onChange] = React.useState(description);

  const changed = description !== value;

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    setDescription(value);
  }, [changed, value]);

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Group align="end">
        <Text>Description</Text>
        <ActionIcon variant="hover" color="blue" disabled={!changed} onClick={submit}>
          <DeviceFloppy size={20} />
        </ActionIcon>
      </Group>
      <RichTextEditor value={value} onChange={onChange} sx={{ flexGrow: 1 }} sticky p="0"/>
    </Stack>
  )
}