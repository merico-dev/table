import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { InfoCircle } from 'tabler-icons-react';
import { LayoutStateContext, usePanelContext } from '../contexts';

export const DescriptionPopover = observer(() => {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const [opened, setOpened] = React.useState(false);
  const { panel } = usePanelContext();

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  if (!panel.description || panel.description === '<p><br></p>') {
    return null;
  }

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title={panel.title} withCloseButton={false}>
        <RichTextEditor readOnly value={panel.description} onChange={_.noop} sx={{ border: 'none' }} />
      </Modal>
      <Tooltip label="Click to see description" position="top-start" withinPortal>
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={() => setOpened((v) => !v)}
          sx={{ verticalAlign: 'baseline', cursor: 'pointer' }}
        >
          <InfoCircle size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
});
