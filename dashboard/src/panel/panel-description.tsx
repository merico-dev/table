import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import _ from 'lodash';
import React from 'react';
import { InfoCircle } from 'tabler-icons-react';
import { LayoutStateContext, PanelContext } from '../contexts';

export function DescriptionPopover() {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const [opened, setOpened] = React.useState(false);
  const { title, description } = React.useContext(PanelContext);

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  if (!description || description === '<p><br></p>') {
    return null;
  }

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title={title} withCloseButton={false}>
        <RichTextEditor readOnly value={description} onChange={_.noop} sx={{ border: 'none' }} />
      </Modal>
      <Tooltip label="Click to see description" position="top-start">
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
}
