import { Box, Modal, Overlay, Stack, Text } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewModelInstance } from '~/model';

export const PreviewViewModal = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  return (
    <Modal
      size={view.config.width}
      overflow="inside"
      opened={true}
      onClose={_.noop}
      withCloseButton={false}
      title={view.name}
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      styles={{
        root: {
          position: 'relative',
          height: 'calc(100% - 46px)',
        },
        overlay: {
          // @ts-expect-error absolute !important
          position: 'absolute !important',
        },
        modal: {
          border: '1px solid #efefef',
          maxHeight: view.config.height,
          overflow: 'scroll',
        },
      }}
      withinPortal={false}
    >
      {children}
    </Modal>
  );
});
