export function getLegend(years: string[]) {
  return {
    show: years.length > 1,
    selectedMode: 'single',
    top: 5,
    right: 5,
    data: years.map((name) => ({
      name,
      icon: 'circle',
    })),
  };
}
