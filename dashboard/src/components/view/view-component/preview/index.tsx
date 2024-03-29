import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { EViewComponentType, ViewRenderModelInstance } from '~/model';
import { PreviewViewDivision } from './division';
import { PreviewViewModal } from './modal';
import { PreviewViewTabs } from './tabs';

export const PreviewViewComponent = observer(
  ({ view, children }: { view: ViewRenderModelInstance; children: ReactNode }) => {
    switch (view.type) {
      case EViewComponentType.Modal:
        return <PreviewViewModal view={view}>{children}</PreviewViewModal>;
      case EViewComponentType.Tabs:
        return <PreviewViewTabs view={view} />;
      case EViewComponentType.Division:
      default:
        return <PreviewViewDivision view={view}>{children}</PreviewViewDivision>;
    }
  },
);
