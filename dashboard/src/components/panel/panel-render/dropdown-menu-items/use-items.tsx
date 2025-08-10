import { useMemo } from 'react';
import { useAdditionalPanelMenuItems } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { PanelMenuItem } from '~/types';
import { Refresh } from './refresh';
import { DownloadData } from './download-data';
import { DownloadScreenshot } from './download-screenshot';
import { EnterFullScreen } from './enter-fullscreen';

export const useItems = (view: ViewMetaInstance) => {
  const { items: additionalItems } = useAdditionalPanelMenuItems();

  return useMemo(() => {
    const ret: PanelMenuItem[] = [
      {
        order: 10,
        render: () => <Refresh key="refresh" />,
      },
      {
        order: 100,
        render: () => <DownloadData key="download-data" />,
      },
      {
        order: 300,
        render: () => <DownloadScreenshot key="download-screenshot" />,
      },
      {
        order: 400,
        render: () => <EnterFullScreen key="enter-full-screen" view={view} />,
      },
      ...additionalItems,
    ];

    return ret.sort((a, b) => a.order - b.order);
  }, [additionalItems]);
};
