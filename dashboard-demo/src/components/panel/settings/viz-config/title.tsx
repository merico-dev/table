import { ActionIcon, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import React from "react";
import { DeviceFloppy } from "tabler-icons-react";
import PanelContext from "../../../../contexts/panel-context";

export function EditTitle() {
  const { title, setTitle } = React.useContext(PanelContext)
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
      label="Panel Title"
      value={localTitle}
      onChange={setLocalTitle}
      rightSection={(
        <ActionIcon disabled={!changed} onClick={submit}>
          <DeviceFloppy size={20} />
        </ActionIcon>
      )}
    />
  )
}