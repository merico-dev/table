import dayjs from 'dayjs';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { getDateRangeShortcuts } from './shortcuts';

describe('getDateRangeShortcuts', () => {
  beforeAll(() => {
    // Mock Date.now() to ensure consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-08-06T10:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('getRange function', () => {
    it('should have end date at the end of the day for all shortcuts', () => {
      const shortcuts = getDateRangeShortcuts();

      // Test ALL shortcuts to ensure consistency
      shortcuts.forEach((shortcut) => {
        const range = shortcut.getRange();
        const endDate = range.value[1];

        // Verify endDate is not null
        expect(endDate, `Shortcut "${shortcut.value}" should have a valid end date`).not.toBeNull();

        // Verify the end date is at the end of the day (23:59:59.xxx)
        if (endDate) {
          const endOfDay = dayjs(endDate).endOf('day');
          expect(endDate.getTime(), `Shortcut "${shortcut.value}" should have end date at the end of the day`).toBe(
            endOfDay.toDate().getTime(),
          );
        }
      });
    });
  });
});
