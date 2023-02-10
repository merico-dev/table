import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewModelInstance } from '~/model';
import { EViewComponentType } from '~/types';
import { RenderViewDivision } from './division';
import { RenderViewModal } from './modal';

export const RenderViewComponent = observer(({ view, children }: { view: ViewModelInstance; children: ReactNode }) => {
  switch (view.type) {
    case EViewComponentType.Modal:
      return <RenderViewModal view={view}>{children}</RenderViewModal>;
    case EViewComponentType.Division:
      return <RenderViewDivision>{children}</RenderViewDivision>;
    case EViewComponentType.Tabs:
      return <RenderViewDivision>{children}</RenderViewDivision>;
    default:
      return <RenderViewDivision>{children}</RenderViewDivision>;
  }
});
