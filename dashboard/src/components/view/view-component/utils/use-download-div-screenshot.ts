import { useContext, useRef } from 'react';
import { ViewRenderModelInstance } from '~/model';
import { CustomizeScreenshotContext } from '../../../../contexts/customize-screenshot-context';

export function useDownloadDivScreenshot(view: ViewRenderModelInstance) {
  const ref = useRef<HTMLDivElement>(null);
  const { onScreenshot } = useContext(CustomizeScreenshotContext);
  const downloadScreenshot = () => {
    const dom = ref.current?.querySelector<HTMLElement>('.react-grid-layout');
    if (!dom) {
      return;
    }
    view.downloadScreenshot(dom, onScreenshot);
  };
  return { ref, downloadScreenshot };
}
