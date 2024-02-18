import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewRenderModelInstance } from '~/model';
import { RenderViewDivision } from '../render';

export const PreviewViewDivision = observer(
  ({ children, view }: { children: ReactNode; view: ViewRenderModelInstance }) => {
    return (
      <RenderViewDivision
        view={view}
        sx={{ paddingTop: '0 !important', paddingBottom: '0 !important', '.dashboard-layout': { margin: 0 } }}
      >
        {children}
      </RenderViewDivision>
    );
  },
);
