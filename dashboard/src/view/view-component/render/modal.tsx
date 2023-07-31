import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useContentModelContext } from '~/contexts';
import { ViewModelInstance } from '~/model';
import { IViewConfigModel_Modal } from '~/model/views/view/modal';

export const RenderViewModal = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  const model = useContentModelContext();
  const config = view.config as IViewConfigModel_Modal;
  const opened = model.views.visibleViewIDs.includes(view.id);
  const close = () => model.views.rmVisibleViewID(view.id);
  return (
    <Modal
      size={config.width}
      centered
      opened={opened}
      onClose={close}
      withCloseButton={false}
      title={config.custom_modal_title.value}
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
        },
        content: {
          border: '1px solid #efefef',
        },
        body: {
          maxHeight: config.height,
          overflow: 'auto',
        },
      }}
      transitionProps={{
        duration: 0,
      }}
    >
      {children}
    </Modal>
  );
});
