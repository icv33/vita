import { GUTTER_WIDTH, minuteToY, TIMELINE_HEIGHT, yToMinute } from '../layout';
import { CALENDAR_DAY_END_MIN, CALENDAR_DAY_START_MIN } from '@/constants/calendar';

describe('timeline geometry', () => {
  it('reserves a valid width for the hour column', () => {
    // Wide enough for "23:00" plus padding, never zero/negative.
    expect(GUTTER_WIDTH).toBeGreaterThanOrEqual(44);
  });

  it('minuteToY and yToMinute round-trip', () => {
    expect(minuteToY(CALENDAR_DAY_START_MIN)).toBe(0);
    expect(yToMinute(minuteToY(CALENDAR_DAY_START_MIN + 90))).toBe(CALENDAR_DAY_START_MIN + 90);
    expect(minuteToY(CALENDAR_DAY_END_MIN)).toBe(TIMELINE_HEIGHT);
  });
});
