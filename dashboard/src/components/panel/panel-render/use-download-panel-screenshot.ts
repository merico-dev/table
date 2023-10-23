// @ts-expect-error dom-to-image-more's declaration file
import domtoimage from 'dom-to-image-more';
import { useRef } from 'react';
import { PanelRenderModelInstance } from '~/model';

export function useDownloadPanelScreenshot(panel: PanelRenderModelInstance) {
  const ref = useRef<HTMLDivElement>(null);
  const downloadPanelScreenshot = () => {
    const dom = ref.current;
    if (!dom) {
      return;
    }

    const width = dom.offsetWidth * 2;
    const height = dom.offsetHeight * 2;
    domtoimage
      .toBlob(ref.current, {
        bgcolor: 'white',
        width,
        height,
        style: { border: 'none', borderRadius: 0, transformOrigin: '0 0', transform: 'scale(2)' },
      })
      .then((blob: string) => {
        window.saveAs(blob, `${panel.name ? panel.name : panel.viz.type}.png`);
      });
  };
  return { ref, downloadPanelScreenshot };
}
