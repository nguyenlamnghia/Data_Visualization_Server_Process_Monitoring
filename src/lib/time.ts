import type { TimelineScale } from '../types';

export function formatDuration(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatTimeLabel(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase();
}

export function minutesFromStart(isoTimestamp: string, startHour: number): number {
  const date = new Date(isoTimestamp);
  const hour = date.getHours();
  const normalizedHour = hour < startHour ? hour + 24 : hour;
  return (normalizedHour - startHour) * 60 + date.getMinutes();
}

export function xForTime(isoTimestamp: string, scale: TimelineScale): number {
  const timelineMinutes = (scale.endHour - scale.startHour) * 60;
  const minutes = minutesFromStart(isoTimestamp, scale.startHour);
  return Math.round((minutes / timelineMinutes) * scale.width);
}

export function widthForDuration(durationMinutes: number, scale: TimelineScale): number {
  const timelineMinutes = (scale.endHour - scale.startHour) * 60;
  return Math.max(3, Math.round((durationMinutes / timelineMinutes) * scale.width));
}
