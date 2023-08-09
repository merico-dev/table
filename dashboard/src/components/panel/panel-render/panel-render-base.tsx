import { Box, Button, Sx } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useRef } from 'react';
import { PanelContextProvider } from '~/contexts/panel-context';
import { PanelRenderModelInstance } from '~/model';
import { DescriptionPopover } from './description-popover';
import './panel-render-base.css';
import { PanelTitleBar } from './title-bar';
import { PanelVizSection } from './viz';
// @ts-expect-error dom-to-image-more's declaration file
import domtoimage from 'dom-to-image-more';

interface IPanelBase {
  panel: PanelRenderModelInstance;
  dropdownContent?: ReactNode;
  panelStyle: Sx;
}

const baseStyle: Sx = { border: '1px solid #e9ecef' };

export const PanelRenderBase = observer(({ panel, panelStyle, dropdownContent }: IPanelBase) => {
  const panelRootRef = useRef<HTMLDivElement>(null);
  const contentHeight = !panel.title ? '100%' : 'calc(100% - 25px - 5px)';
  const downloadPanelScreenshot = () => {
    domtoimage.toJpeg(panelRootRef.current, { quality: 1, bgcolor: 'white' }).then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = 'my-image-name.jpeg';
      link.href = dataUrl;
      link.click();
    });
  };
  return (
    <PanelContextProvider
      value={{
        panel,
        data: panel.data,
        loading: panel.dataLoading,
        errors: panel.queryErrors,
        downloadPanelScreenshot,
      }}
    >
      <Box
        className="panel-root"
        ref={panelRootRef}
        p={5}
        pt={0}
        sx={{
          ...baseStyle,
          ...panelStyle,
        }}
      >
        <Box sx={{ position: 'absolute', left: 0, top: 0, height: 28, zIndex: 310 }}>
          <DescriptionPopover />
        </Box>
        {dropdownContent}
        <PanelTitleBar />
        <PanelVizSection panel={panel} height={contentHeight} />
      </Box>
    </PanelContextProvider>
  );
});
