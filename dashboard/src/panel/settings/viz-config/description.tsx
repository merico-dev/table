import { ActionIcon, Textarea, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import { PanelContext } from "../../../contexts/panel-context";

export function EditDescription() {
  const { description, setDescription } = React.useContext(PanelContext)
  const [localDesc, setLocalDesc] = useInputState(description);

  const changed = description !== localDesc;

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    setDescription(localDesc);
  }, [changed, localDesc]);

  return (
    <Textarea
      label="Panel Description"
      value={localDesc}
      onChange={setLocalDesc}
      minRows={2}
      rightSection={(
        <ActionIcon disabled={!changed} onClick={submit} sx={{ alignSelf: 'flex-start', marginTop: '4px' }}>
          <DeviceFloppy size={20} />
        </ActionIcon>
      )}
    />
  )
}