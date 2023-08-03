import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { PreviewViewDivision } from './division';
import { PreviewViewModal } from './modal';
import { PreviewViewTabs } from './tabs';

export const PreviewViewComponent = observer(({ view, children }: { view: ViewMetaInstance; children: ReactNode }) => {
  switch (view.type) {
    case EViewComponentType.Modal:
      return <PreviewViewModal view={view}>{children}</PreviewViewModal>;
    case EViewComponentType.Tabs:
      return <PreviewViewTabs view={view}>{children}</PreviewViewTabs>;
    case EViewComponentType.Division:
    default:
      return <PreviewViewDivision>{children}</PreviewViewDivision>;
  }
});
