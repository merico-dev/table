// @ts-expect-error dom-to-image-more's declaration file
import domtoimage from 'dom-to-image-more';
import { useRef } from 'react';
import { ViewMetaInstance } from '~/model';

export function useDownloadModalScreenshot(view: ViewMetaInstance) {
  const ref = useRef<HTMLDivElement>(null);
  const downloadScreenshot = () => {
    const dom = ref.current?.parentElement?.parentElement; // view content -> modal body -> modal-content(including modal-header)
    if (!dom) {
      return;
    }
    const triggerButton = dom.querySelector<HTMLElement>('.download-screenshot-button');
    const hideButton = () => triggerButton?.style?.setProperty('visibility', 'hidden');
    const showButton = () => triggerButton?.style?.setProperty('visibility', 'visible');

    hideButton();

    const width = dom.offsetWidth * 2;
    const height = dom.offsetHeight * 2;
    domtoimage
      .toBlob(dom, {
        bgcolor: 'white',
        width,
        height,
        style: {
          transformOrigin: '0 0',
          transform: 'scale(2)',
        },
      })
      .then((blob: string) => {
        window.saveAs(blob, `${view.name}.png`);
      })
      .finally(showButton);
  };
  return { ref, downloadScreenshot };
}
