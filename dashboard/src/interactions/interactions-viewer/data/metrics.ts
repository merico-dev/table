export function calc(index: number, unit: number, gap: number) {
  const ret = index * unit + index * gap;
  return ret;
}

export function calcTotal(count: number, unit: number, gap: number) {
  const ret = count * unit + (count - 1) * gap;
  return ret;
}

export const FilterWidth = 200;
export const FilterHeight = 40;
export const FilterPaddingT = 40;
export const FilterPaddingB = 25;
export const FilterPaddingL = 25;
export const FilterPaddingR = 25;
export const FilterGap = 25;

export const ViewPaddingX = 25;
export const ViewPaddingT = 40;
export const ViewPaddingB = 25;
export const ViewPaddingY = ViewPaddingT + ViewPaddingB;
export const ViewWidth = 350;
export const ViewHeight = 150;
export const ViewGapX = 150;
export const ViewGapY = 150;

export const PanelWidth = 300;
export const PanelHeight = 40;
export const PanelGapX = 25;
export const PanelGapY = 25;

export const LaneGapX = 300;
