import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewMetaInstance } from '~/model';
import { RenderViewDivision } from '../render';

export const PreviewViewDivision = observer(({ children, view }: { children: ReactNode; view: ViewMetaInstance }) => {
  return (
    <RenderViewDivision sx={{ paddingBottom: '100px' }} view={view}>
      {children}
    </RenderViewDivision>
  );
});
