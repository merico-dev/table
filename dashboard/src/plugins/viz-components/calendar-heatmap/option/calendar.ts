import dayjs from 'dayjs';

function getRange(oneYearMode: boolean, minDate: number, years: string[]) {
  if (!oneYearMode) {
    return years[0];
  }
  try {
    return [minDate, dayjs(minDate).add(1, 'year').subtract(1, 'day').valueOf()];
  } catch (error) {
    console.error(error);
    return years[0];
  }
}

export function getCalendar(oneYearMode: boolean, minDate: number, years: string[]) {
  const range = getRange(oneYearMode, minDate, years);
  return {
    top: 50,
    left: 25,
    right: 5,
    cellSize: ['auto', 13],
    range,
    itemStyle: {
      borderColor: '#eee',
    },
    splitLine: {
      show: true,
    },
    dayLabel: {
      firstDay: 1,
    },
    monthLabel: {
      position: 'end',
    },
    yearLabel: { show: true },
  };
}
