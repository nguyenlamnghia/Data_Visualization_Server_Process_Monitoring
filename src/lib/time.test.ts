import { describe, expect, it } from 'vitest';
import { formatDuration, formatTimeLabel, minutesFromStart, xForTime } from './time';

describe('time helpers', () => {
  it('formats duration as h:mm:ss', () => {
    expect(formatDuration(414.93)).toBe('6:54:56');
    expect(formatDuration(124.93)).toBe('2:04:56');
  });

  it('formats clock labels for presentation', () => {
    expect(formatTimeLabel('2016-03-20T16:55:00')).toBe('4:55 pm');
    expect(formatTimeLabel('2016-03-20T00:05:00')).toBe('12:05 am');
  });

  it('maps timestamps across midnight onto a continuous timeline', () => {
    expect(minutesFromStart('2016-03-20T17:00:00', 5)).toBe(720);
    expect(minutesFromStart('2016-03-21T02:00:00', 5)).toBe(1260);
  });

  it('converts time to x position', () => {
    expect(xForTime('2016-03-20T17:00:00', { startHour: 5, endHour: 32, width: 1080 })).toBe(480);
  });
});
