import { useRef } from 'react';
import { ViewRenderModelInstance } from '~/model';

export function useDownloadDivScreenshot(view: ViewRenderModelInstance) {
  const ref = useRef<HTMLDivElement>(null);
  const downloadScreenshot = () => {
    const dom = ref.current?.querySelector<HTMLElement>('.react-grid-layout');
    if (!dom) {
      return;
    }
    view.downloadScreenshot(dom);
  };
  return { ref, downloadScreenshot };
}
