function upgradePanels(panels: Record<string, any>[]) {
  return panels.map((p) => {
    const { title, ...rest } = p;
    if (typeof title !== 'string') {
      return p;
    }
    const name = title ? title : p.id;
    return {
      ...rest,
      name,
      title: {
        show: !!title,
      },
    };
  });
}

/**
 * https://github.com/merico-dev/table/issues/1217
 */
export function main({ panels, ...rest }: Record<string, any>) {
  const finalPanels = upgradePanels(panels);
  return {
    ...rest,
    panels: finalPanels,
    version: '10.41.0',
  };
}
