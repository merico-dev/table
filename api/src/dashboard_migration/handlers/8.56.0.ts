type PanelType = {
  id: string;
  layout: {
    h: number;
    [key: string]: any;
  };
  [key: string]: any;
};

const prevRowHeight = 10;
const prevMarginH = 10;

function changeRowHeight(panels: PanelType[]) {
  const finalPanels: PanelType[] = panels.map((p) => {
    const { layout, ...rest } = p;
    const height = prevRowHeight * layout.h + prevMarginH * layout.h;
    return {
      ...rest,
      layout: {
        ...layout,
        h: height, // rowHeight changed from 10 to 1, marginH changed from 10 to 0
      },
    };
  });

  return finalPanels;
}

/**
 * https://github.com/merico-dev/table/issues/849
 * @param schema
 * @returns new schema
 */
export function main({ panels, ...rest }: Record<string, any>) {
  const finalPanels = changeRowHeight(panels);
  return {
    ...rest,
    panels: finalPanels,
    version: '8.56.0',
  };
}
