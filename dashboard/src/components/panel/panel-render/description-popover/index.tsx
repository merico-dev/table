import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ReadonlyRichText } from '~/components/widgets/rich-text-editor/readonly-rich-text-editor';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { parseRichTextContent } from '~/utils';

function isRichTextContentEmpty(str: string) {
  if (!str) {
    return true;
  }
  return ['<p><br></p>', '<p></p>'].includes(str);
}

const RenderPanelDescription = observer(() => {
  const contentModel = useRenderContentModelContext();
  const { panel } = useRenderPanelContext();

  const content = useMemo(() => {
    return parseRichTextContent(panel.description, panel.json.variables, contentModel.payloadForViz, panel.data);
  }, [panel.data, panel.description, panel.json.variables, contentModel.payloadForViz]);

  return (
    <ReadonlyRichText
      value={content}
      styles={{
        root: { border: 'none' },
        content: { padding: 0 },
      }}
      sx={{
        '.mantine-RichTextEditor-content .ProseMirror': { padding: '0 !important' },
      }}
      dashboardState={contentModel.dashboardState}
      variableAggValueMap={panel.variableAggValueMap}
    />
  );
});
export const DescriptionPopover = observer(() => {
  const { t } = useTranslation();
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
        title={panel.title.show ? panel.name : ''}
        withCloseButton={false}
        withinPortal
        zIndex={310}
      >
        <RenderPanelDescription />
      </Modal>
      <Tooltip label={t('panel.panel_description_click')} position="top-start" withinPortal>
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={() => setOpened((v) => !v)}
          sx={{ verticalAlign: 'baseline', cursor: 'pointer' }}
        >
          <IconInfoCircle size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
});
