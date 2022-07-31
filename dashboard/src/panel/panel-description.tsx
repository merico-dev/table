import { HoverCard, Tooltip } from "@mantine/core";
import React from "react";
import { InfoCircle } from "tabler-icons-react";
import { LayoutStateContext, PanelContext } from "../contexts";
import RichTextEditor from '@mantine/rte';
import _ from "lodash";

interface IDescriptionPopover {
  position?: 'top' | 'left' | 'bottom' | 'right';
  trigger?: 'hover' | 'click';
}

export function DescriptionPopover({ position = 'bottom', trigger = 'hover' }: IDescriptionPopover) {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const [opened, setOpened] = React.useState(false);
  const { description } = React.useContext(PanelContext)

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  if (!description || description === '<p><br></p>') {
    return null;
  }

  const target = trigger === 'click' ? (
    <Tooltip label="Click to see description" openDelay={500}>
      <InfoCircle
        size={20}
        onClick={() => setOpened(v => !v)}
        style={{ verticalAlign: 'baseline', cursor: 'pointer' }}
      />
    </Tooltip>
  ): (
    <InfoCircle
      size={20}
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
      style={{ verticalAlign: 'baseline', cursor: 'pointer' }}
    />
  );

  return (
    <HoverCard
      withArrow
      position={position}
      width="40vw"
    >
      <HoverCard.Target>
        {target}
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <RichTextEditor readOnly value={description} onChange={_.noop} sx={{ border: 'none' }} />
      </HoverCard.Dropdown>
    </HoverCard>
  )
}
