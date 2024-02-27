import { Box, Overlay } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { ReactNode, useEffect } from 'react';
import { useEditContentModelContext } from '~/contexts';
import { ViewRenderModelInstance } from '~/model';
import { RenderViewDivision } from '../render';

export const PreviewViewDivision = observer(
  ({ children, view }: { children: ReactNode; view: ViewRenderModelInstance }) => {
    const contentModel = useEditContentModelContext();
    const layoutsModel = contentModel.layouts;

    const [ref, rect] = useResizeObserver();
    useEffect(() => {
      layoutsModel.setCurrentLayoutWrapperWidth(rect.width);
    }, [rect.width]);

    return (
      <Box sx={{ height: '100%' }} ref={ref}>
        <Box
          sx={{
            paddingBottom: '100px',
            background: 'white',
            margin: '0 auto',
            width: layoutsModel.currentLayoutPreviewWidth ?? '100%',
            transform: `scale(${layoutsModel.divisionPreviewScale})`,
            transformOrigin: '0 0',
          }}
        >
          <RenderViewDivision
            view={view}
            sx={{
              paddingTop: '0px !important',
            }}
          >
            {children}
          </RenderViewDivision>
        </Box>
      </Box>
    );
  },
);
