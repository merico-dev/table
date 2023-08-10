// @ts-expect-error dom-to-image-more's declaration file
import domtoimage from 'dom-to-image-more';
import { useRef } from 'react';
import { ViewMetaInstance } from '~/model';

export function useDownloadDivScreenshot(view: ViewMetaInstance) {
  const ref = useRef<HTMLDivElement>(null);
  const downloadScreenshot = () => {
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
        style: { transformOrigin: '0 0', transform: 'scale(2)' },
      })
      .then((blob: string) => {
        window.saveAs(blob, `${view.name}.png`);
      });
  };
  return { ref, downloadScreenshot };
}
