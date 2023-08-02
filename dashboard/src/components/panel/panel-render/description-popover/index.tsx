import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { InfoCircle } from 'tabler-icons-react';
import { ReadonlyRichText } from '~/components/widgets/rich-text-editor/readonly-rich-text-editor';
import { useRenderPanelContext } from '~/contexts';

function isRichTextContentEmpty(str: string) {
  if (!str) {
    return true;
  }
  return ['<p><br></p>', '<p></p>'].includes(str);
}

export const DescriptionPopover = observer(() => {
  const [opened, setOpened] = React.useState(false);
  const { panel } = useRenderPanelContext();

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
