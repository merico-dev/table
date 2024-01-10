import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewRenderModelInstance } from '~/model';
import { RenderViewDivision } from '../render';

export const PreviewViewDivision = observer(
  ({ children, view }: { children: ReactNode; view: ViewRenderModelInstance }) => {
    return (
      <RenderViewDivision sx={{ paddingBottom: '100px' }} view={view}>
        {children}
      </RenderViewDivision>
    );
  },
);
