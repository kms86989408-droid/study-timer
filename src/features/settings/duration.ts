export const DURATION_STEP_MINUTES = 5;
export const MIN_DURATION_MINUTES = 5;
export const MAX_DURATION_MINUTES = 180;
export const DEFAULT_STUDY_MINUTES = 25;
export const DEFAULT_REST_MINUTES = 5;

export function isFiveMinuteStep(minutes: number): boolean {
  return Number.isInteger(minutes) && minutes >= MIN_DURATION_MINUTES && minutes % DURATION_STEP_MINUTES === 0;
}

export function normalizeDurationMinutes(minutes: number, fallback = DEFAULT_STUDY_MINUTES): number {
  if (!Number.isFinite(minutes)) {
    return fallback;
  }

  const roundedToStep = Math.round(minutes / DURATION_STEP_MINUTES) * DURATION_STEP_MINUTES;

  return Math.min(MAX_DURATION_MINUTES, Math.max(MIN_DURATION_MINUTES, roundedToStep));
}

export function durationMinutesToSeconds(minutes: number): number {
  if (!isFiveMinuteStep(minutes)) {
    throw new RangeError("Duration must be a positive 5-minute step.");
  }

  return minutes * 60;
}

export function formatDurationLabel(minutes: number): string {
  const normalizedMinutes = normalizeDurationMinutes(minutes);
  const hours = Math.floor(normalizedMinutes / 60);
  const remainingMinutes = normalizedMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}분`;
  }

  if (remainingMinutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${remainingMinutes}분`;
}

export function formatTimerClock(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
