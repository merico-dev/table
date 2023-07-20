import { Box, Modal } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { ReactNode, useMemo } from 'react';
import { ViewModelInstance } from '~/dashboard-editor/model';
import { IViewConfigModel_Modal } from '~/dashboard-editor/model/views/view/modal';

function viewportSizeToPercentage(size: string) {
  return size.replace(/(vw|vh)/, '%');
}

export const PreviewViewModal = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  const config = view.config as IViewConfigModel_Modal;
  const { width, height } = useMemo(() => {
    return {
      width: viewportSizeToPercentage(config.width),
      height: viewportSizeToPercentage(config.height),
    };
  }, [config.width, config.height]);
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
        title={config.custom_modal_title.value}
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

            width,
            height,
          },
          content: {
            border: '1px solid #efefef',
          },
          body: {
            maxHeight: 'calc(100vh - 325px)',
          },
        }}
        withinPortal={false}
        transitionProps={{
          duration: 0,
        }}
      >
        {children}
      </Modal>
    </Box>
  );
});
