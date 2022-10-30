import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useModelContext } from '~/contexts';
import { ViewModelInstance } from '~/model';

export const RenderViewModal = observer(({ children, view }: { children: ReactNode; view: ViewModelInstance }) => {
  const model = useModelContext();
  const opened = model.views.visibleViewIDs.includes(view.id);
  const close = () => model.views.rmVisibleViewID(view.id);
  return (
    <Modal
      size={view.config.width}
      centered
      overflow="inside"
      opened={opened}
      onClose={close}
      withCloseButton={false}
      title={view.name}
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      styles={{
        modal: {
          border: '1px solid #efefef',
        },
        body: {
          maxHeight: view.config.height,
          overflow: 'scroll',
        },
      }}
      transitionDuration={0}
    >
      {children}
    </Modal>
  );
});
