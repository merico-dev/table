import { Popover, Tooltip } from "@mantine/core";
import React from "react";
import { InfoCircle } from "tabler-icons-react";
import { LayoutStateContext, PanelContext } from "../contexts";
import RichTextEditor from '@mantine/rte';
import _ from "lodash";

export function DescriptionPopover() {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const [opened, setOpened] = React.useState(false);
  const { description } = React.useContext(PanelContext)

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  if (!description) {
    return null;
  }

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton
      withArrow
      trapFocus
      closeOnEscape={false}
      target={(
        <Tooltip label="Click to see description" openDelay={500}>
          <InfoCircle
            size={20}
            onClick={() => setOpened(v => !v)}
            style={{ verticalAlign: 'baseline', cursor: 'pointer' }}
          />
        </Tooltip>
      )}
    >
      <RichTextEditor readOnly value={description} onChange={_.noop} sx={{ border: 'none' }} />
    </Popover>
  )
}
