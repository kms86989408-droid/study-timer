import type { TimerMode } from "./timer";

type VisualProgressInput = {
  remainingSeconds: number;
  totalSeconds: number;
};

export function getVisualProgressPercent({ remainingSeconds, totalSeconds }: VisualProgressInput): number {
  if (totalSeconds <= 0) {
    return 0;
  }

  const ratio = remainingSeconds / totalSeconds;
  const clampedRatio = Math.min(1, Math.max(0, ratio));

  return Math.round(clampedRatio * 100);
}

export function getVisualMaskHeight(input: VisualProgressInput): string {
  return `${getVisualProgressPercent(input)}%`;
}

export function getVisualProgressTone(mode: TimerMode): string {
  return mode === "study" ? "bg-moss/10 text-moss" : "bg-peach/10 text-peach";
}
