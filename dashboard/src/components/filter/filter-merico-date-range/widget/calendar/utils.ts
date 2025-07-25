import dayjs from 'dayjs';

export function getStartOf(date: Date | null, step: string) {
  if (!date) {
    return null;
  }
  const d = dayjs(date);
  switch (step) {
    case 'day':
    case 'week':
    case 'month':
    case 'quarter':
      return d.startOf(step);
    case 'bi-week':
      return d.startOf('week').subtract(1, 'week'); // [last week, current week]
    default:
      throw new Error(`[merico-date-range] unexpected date-range step: ${step}`);
  }
}

export function getEndOf(date: Date | null, step: string) {
  if (!date) {
    return null;
  }
  const d = dayjs(date);
  switch (step) {
    case 'day':
    case 'week':
    case 'month':
    case 'quarter':
      return d.endOf(step);
    case 'bi-week':
      return d.endOf('week'); // [last week, current week]
    default:
      throw new Error(`[merico-date-range] unexpected date-range step: ${step}`);
  }
}
