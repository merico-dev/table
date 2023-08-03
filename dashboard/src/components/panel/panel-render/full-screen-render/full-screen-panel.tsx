import { Button, Group, Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ArrowLeft } from 'tabler-icons-react';
import { PanelRenderModelInstance, ViewMetaInstance } from '~/model';
import { PanelRender } from '../panel-render';

const modalStyles = {
  modal: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  body: {
    display: 'flex',
    height: 'calc(100vh - 88px)',
  },
} as const;

export const FullScreenPanel = observer(function _FullScreenPanel({
  view,
  panel,
  exitFullScreen,
}: {
  view: ViewMetaInstance;
  panel: PanelRenderModelInstance;
  exitFullScreen: () => void;
}) {
  return (
    <Modal
      opened
      fullScreen
      onClose={exitFullScreen}
      title={
        <Button color="blue" size="xs" onClick={exitFullScreen} leftIcon={<ArrowLeft size={20} />}>
          Exit fullscreen
        </Button>
      }
      styles={modalStyles}
    >
      <Group grow sx={{ flexGrow: 1, flexShrink: 0 }}>
        <PanelRender view={view} panel={panel} />
      </Group>
    </Modal>
  );
});
