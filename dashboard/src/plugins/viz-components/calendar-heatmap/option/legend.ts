export function getLegend(oneYearMode: boolean, years: string[]) {
  return {
    show: !oneYearMode,
    selectedMode: 'single',
    top: 5,
    right: 5,
    data: years.map((name) => ({
      name,
      icon: 'circle',
    })),
  };
}
