import dayjs, { Dayjs } from 'dayjs';
import { DateRangeValue_Value } from '~/model';

function formatBiWeek(begin: Dayjs, end: Dayjs): DateRangeValue_Value {
  const b = begin.startOf('week');
  let e = b.add(1, 'week').endOf('week');
  while (e.isBefore(end)) {
    e = e.add(2, 'week');
  }
  return [b.toDate(), e.toDate()];
}

export function formatDatesWithStep(begin: Date | null, end: Date | null, step: string): DateRangeValue_Value {
  if (!begin || !end) {
    return [null, null];
  }
  return formatWithStep(dayjs(begin), dayjs(end), step);
}

export function formatWithStep(begin: Dayjs | null, end: Dayjs | null, step: string): DateRangeValue_Value {
  if (!begin || !end) {
    return [null, null];
  }
  switch (step) {
    case 'day':
      return [begin.startOf('day').toDate(), end.endOf('day').toDate()];
    case 'week':
      return [begin.startOf('week').toDate(), end.endOf('week').toDate()];
    case 'bi-week':
      return formatBiWeek(begin, end);
    case 'month':
      return [begin.startOf('month').toDate(), end.endOf('month').toDate()];
    case 'quarter':
      return [begin.startOf('quarter').toDate(), end.endOf('quarter').toDate()];
    default:
      throw new Error(`[merico-date-range] unexpected date-range step: ${step}`);
  }
}
