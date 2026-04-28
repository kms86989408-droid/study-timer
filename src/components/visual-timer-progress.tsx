import { getVisualMaskHeight, getVisualProgressPercent, getVisualProgressTone } from "@/features/timer/visual-progress";
import { timerModeLabels, type TimerState } from "@/features/timer/timer";

type VisualTimerProgressProps = {
  timer: TimerState;
};

const sceneStyle = {
  backgroundImage: "url('/focus-scene.svg')",
  backgroundPosition: "center bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "min(82%, 460px) auto",
};

export function VisualTimerProgress({ timer }: VisualTimerProgressProps) {
  const modeLabel = timerModeLabels[timer.mode];
  const maskHeight = getVisualMaskHeight(timer);
  const progressPercent = getVisualProgressPercent(timer);
  const toneClassName = getVisualProgressTone(timer.mode);

  return (
    <figure className="mt-8">
      <div
        role="meter"
        aria-label={`남은 ${modeLabel} 시간 이미지`}
        aria-valuemin={0}
        aria-valuemax={timer.totalSeconds}
        aria-valuenow={timer.remainingSeconds}
        data-progress-percent={progressPercent}
        data-testid="visual-progress"
        className="relative min-h-64 overflow-hidden rounded-lg border border-[var(--line)] bg-white"
      >
        <div className="absolute inset-0 opacity-20 grayscale" style={sceneStyle} aria-hidden="true" />
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden transition-[height] duration-500"
          data-testid="visual-progress-mask"
          style={{ height: maskHeight }}
          aria-hidden="true"
        >
          <div className="absolute inset-x-0 bottom-0 h-64" style={sceneStyle} />
        </div>
        <div className="absolute inset-x-5 bottom-5 h-2 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
          <div className="h-full rounded-full bg-moss transition-[width] duration-500" style={{ width: maskHeight }} />
        </div>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className={`rounded-md px-3 py-1 font-semibold ${toneClassName}`}>{modeLabel}</span>
        <span className="font-semibold text-[var(--muted)]">남은 시간</span>
      </figcaption>
    </figure>
  );
}
