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
        render: Refresh,
      },
      {
        order: 20,
        render: DownloadData,
      },
      {
        order: 30,
        render: DownloadScreenshot,
      },
      {
        order: 50,
        render: () => <EnterFullScreen view={view} />,
      },
      ...additionalItems,
    ];

    return ret.sort((a, b) => a.order - b.order);
  }, [additionalItems]);
};
