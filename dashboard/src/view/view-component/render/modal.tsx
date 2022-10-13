import { Modal } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewModelInstance } from '~/model';

// TODO: opened state
export const RenderViewModal = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  return (
    <Modal
      size={view.config.width}
      centered
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
        overlay: {
          display: 'none',
        },
        modal: {
          border: '1px solid #efefef',
        },
      }}
    >
      {children}
    </Modal>
  );
});
