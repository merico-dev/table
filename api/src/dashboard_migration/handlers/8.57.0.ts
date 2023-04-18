type PanelType = {
  id: string;
  layout: {
    w: number;
    [key: string]: any;
  };
  [key: string]: any;
};

function changeRowHeight(panels: PanelType[]) {
  const finalPanels: PanelType[] = panels.map((p) => {
    const { layout, ...rest } = p;
    // from 12 cols to 36 cols
    const w = layout.w * 3;
    const x = layout.x * 3;
    return {
      ...rest,
      layout: {
        ...layout,
        w,
        x,
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
    version: '8.57.0',
  };
}
