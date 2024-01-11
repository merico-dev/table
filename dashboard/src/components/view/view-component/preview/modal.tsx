import { Box, Group, Modal } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { ReactNode, useMemo } from 'react';
import { ViewModalConfigInstance, ViewRenderModelInstance } from '~/model';
import { TakeScreenshot } from '../render/modal';
import { useDownloadDivScreenshot } from '../utils';

function viewportSizeToPercentage(size: string) {
  return size.replace(/(vw|vh)/, '%');
}

export const PreviewViewModal = observer(
  ({ children, view }: { children: ReactNode; view: ViewRenderModelInstance }) => {
    const config = view.config as ViewModalConfigInstance;
    const { width, height } = useMemo(() => {
      return {
        width: viewportSizeToPercentage(config.width),
        height: viewportSizeToPercentage(config.height),
      };
    }, [config.width, config.height]);

    // const { ref, downloadScreenshot } = useDownloadModalScreenshot(view);
    const { ref, downloadScreenshot } = useDownloadDivScreenshot(view);
    return (
      <Box
        sx={{
          height: '100%',
          '> div:not(.mantine-Modal-root)': {
            height: '100%',
          },
        }}
      >
        <Modal
          size={config.width}
          opened={true}
          onClose={_.noop}
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
              position: 'relative',
              height: '100%',
            },
            overlay: {
              // @ts-expect-error absolute !important
              position: 'absolute !important',
            },
            inner: {
              position: 'relative',
              top: '50%',
              left: '50%',
              right: 'unset',
              bottom: 'unset',
              transform: 'translate(-50%, -50%)',
              padding: '0 !important',

              width,
              height,
              maxHeight: height,
            },
            content: {
              border: '1px solid #efefef',
              height: '100%',
            },
            body: {
              maxHeight: 'calc(100% - 48px)',
              overflow: 'auto',
            },
            header: {
              padding: 0,
            },
            title: {
              flexGrow: 1,
            },
          }}
          withinPortal={false}
          transitionProps={{
            duration: 0,
          }}
        >
          <Box ref={ref}>{children}</Box>
        </Modal>
      </Box>
    );
  },
);
