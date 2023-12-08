import { ActionIcon, Box, Group, Modal } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useRenderContentModelContext } from '~/contexts';
import { ViewMetaInstance, ViewModalConfigInstance } from '~/model';
import { useDownloadDivScreenshot, useDownloadModalScreenshot } from '../utils';

export const TakeScreenshot = observer(({ downloadScreenshot }: { downloadScreenshot: () => void }) => {
  return (
    <ActionIcon className="download-screenshot-button" color="blue" onClick={downloadScreenshot}>
      <IconCamera size={14} />
    </ActionIcon>
  );
});

export const RenderViewModal = observer(({ children, view }: { children: ReactNode; view: ViewMetaInstance }) => {
  const model = useRenderContentModelContext();
  const config = view.config as ViewModalConfigInstance;
  const opened = model.views.visibleViewIDs.includes(view.id);
  const close = () => model.views.rmVisibleViewID(view.id);

  // const { ref, downloadScreenshot } = useDownloadModalScreenshot(view);
  const { ref, downloadScreenshot } = useDownloadDivScreenshot(view);
  return (
    <Modal
      size={config.width}
      centered
      opened={opened}
      onClose={close}
      withCloseButton={false}
      title={
        <Group position="apart" px="1rem" h="48px">
          <Box>{config.custom_modal_title.value}</Box>
          <TakeScreenshot downloadScreenshot={downloadScreenshot} />
        </Group>
      }
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      styles={{
        root: {
          position: 'fixed',
          zIndex: 200,
          inset: 0,
        },
        overlay: {
          zIndex: 'unset',
        },
        inner: {
          zIndex: 'unset',
          padding: '0 !important',
        },
        content: {
          border: '1px solid #efefef',
          maxHeight: 'unset !important',
          overflow: 'hidden',
        },
        body: {
          maxHeight: config.height,
          overflow: 'auto',
          position: 'relative',
          paddingBottom: 10,
        },
        header: {
          padding: 0,
        },
        title: {
          flexGrow: 1,
        },
      }}
      transitionProps={{
        duration: 0,
      }}
    >
      <Box ref={ref}>{children}</Box>
    </Modal>
  );
});
