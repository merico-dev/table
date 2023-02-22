import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { InfoCircle } from 'tabler-icons-react';
import { LayoutStateContext, usePanelContext } from '../contexts';
import { ReadonlyRichText } from './settings/common/readonly-rich-text-editor';

function isRichTextContentEmpty(str: string) {
  if (!str) {
    return true;
  }
  return ['<p><br></p>', '<p></p>'].includes(str);
}

export const DescriptionPopover = observer(() => {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const [opened, setOpened] = React.useState(false);
  const { panel } = usePanelContext();

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  if (isRichTextContentEmpty(panel.description)) {
    return null;
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={panel.title}
        withCloseButton={false}
        withinPortal
        zIndex={310}
      >
        <ReadonlyRichText value={panel.description} styles={{ root: { border: 'none' }, content: { padding: 0 } }} />
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
