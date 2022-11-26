import _ from 'lodash';
import { useMemo } from 'react';

export function useSuggestedWidth(label: string, data: Array<Record<string, any>>) {
  return useMemo(() => {
    const padding = 44;
    const unit = 16;

    const maxLen =
      _.maxBy(data, (r) => {
        return r.label.length;
      })?.label.length ?? 0;
    const maxWidthByData = padding + maxLen * unit;

    const labelLen = label.length;
    const maxWidthByLabel = labelLen * unit; // label has no padding
    return Math.max(maxWidthByData, maxWidthByLabel);
  }, [label, data]);
}
