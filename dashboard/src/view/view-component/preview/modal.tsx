import { Modal } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewModelInstance } from '~/model';
import { IViewConfigModel_Modal } from '~/model/views/view/modal';

export const PreviewViewModal = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  const config = view.config as IViewConfigModel_Modal;
  return (
    <Modal
      size={config.width}
      overflow="inside"
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
        modal: {
          border: '1px solid #efefef',
        },
        body: {
          maxHeight: 'calc(100vh - 325px)',
        },
      }}
      withinPortal={false}
      transitionDuration={0}
    >
      {children}
    </Modal>
  );
});
