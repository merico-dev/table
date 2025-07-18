import { noop } from 'lodash';
import React from 'react';

export interface ICustomizeScreenshotContext {
  onScreenshot: (canvas: HTMLCanvasElement) => void;
}

export const CustomizeScreenshotContext = React.createContext<ICustomizeScreenshotContext>({
  onScreenshot: noop,
});
