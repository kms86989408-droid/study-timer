import {
  DEFAULT_REST_MINUTES,
  DEFAULT_STUDY_MINUTES,
  durationMinutesToSeconds,
  isFiveMinuteStep,
} from "@/features/settings/duration";

export type TimerMode = "study" | "rest";
export type TimerStatus = "idle" | "running" | "paused" | "completed" | "ended";

export type TimerSettings = {
  studyMinutes: number;
  restMinutes: number;
};

export type TimerState = {
  mode: TimerMode;
  status: TimerStatus;
  settings: TimerSettings;
  remainingSeconds: number;
  totalSeconds: number;
  elapsedSeconds: number;
};

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  studyMinutes: DEFAULT_STUDY_MINUTES,
  restMinutes: DEFAULT_REST_MINUTES,
};

export const timerModeLabels: Record<TimerMode, string> = {
  study: "공부",
  rest: "휴식",
};

export const timerStatusLabels: Record<TimerStatus, string> = {
  idle: "준비",
  running: "진행 중",
  paused: "일시정지",
  completed: "완료",
  ended: "종료",
};

function durationForMode(settings: TimerSettings, mode: TimerMode): number {
  return mode === "study" ? settings.studyMinutes : settings.restMinutes;
}

export function assertTimerSettings(settings: TimerSettings): void {
  if (!isFiveMinuteStep(settings.studyMinutes)) {
    throw new RangeError("Study duration must be a positive 5-minute step.");
  }

  if (!isFiveMinuteStep(settings.restMinutes)) {
    throw new RangeError("Rest duration must be a positive 5-minute step.");
  }
}

export function createTimerState(
  settings: TimerSettings = DEFAULT_TIMER_SETTINGS,
  mode: TimerMode = "study",
): TimerState {
  assertTimerSettings(settings);

  const totalSeconds = durationMinutesToSeconds(durationForMode(settings, mode));

  return {
    mode,
    status: "idle",
    settings,
    remainingSeconds: totalSeconds,
    totalSeconds,
    elapsedSeconds: 0,
  };
}

export function startTimer(state: TimerState): TimerState {
  if (state.status === "running") {
    return state;
  }

  if (state.status === "completed" || state.status === "ended" || state.remainingSeconds === 0) {
    return {
      ...state,
      status: "running",
      remainingSeconds: state.totalSeconds,
      elapsedSeconds: 0,
    };
  }

  return {
    ...state,
    status: "running",
  };
}

export function pauseTimer(state: TimerState): TimerState {
  if (state.status !== "running") {
    return state;
  }

  return {
    ...state,
    status: "paused",
  };
}

export function resumeTimer(state: TimerState): TimerState {
  if (state.status !== "paused") {
    return state;
  }

  return {
    ...state,
    status: "running",
  };
}

export function endTimer(state: TimerState): TimerState {
  const elapsedSeconds = state.totalSeconds - state.remainingSeconds;

  return {
    ...state,
    status: "ended",
    remainingSeconds: 0,
    elapsedSeconds: Math.max(0, elapsedSeconds),
  };
}

export function resetTimer(state: TimerState): TimerState {
  return {
    ...state,
    status: "idle",
    remainingSeconds: state.totalSeconds,
    elapsedSeconds: 0,
  };
}

export function tickTimer(state: TimerState, elapsedSeconds = 1): TimerState {
  if (state.status !== "running" || elapsedSeconds <= 0) {
    return state;
  }

  const remainingSeconds = Math.max(0, state.remainingSeconds - Math.floor(elapsedSeconds));
  const actualElapsedSeconds = state.remainingSeconds - remainingSeconds;

  return {
    ...state,
    status: remainingSeconds === 0 ? "completed" : "running",
    remainingSeconds,
    elapsedSeconds: Math.min(state.totalSeconds, state.elapsedSeconds + actualElapsedSeconds),
  };
}

export function switchTimerMode(state: TimerState, mode: TimerMode): TimerState {
  return createTimerState(state.settings, mode);
}

export function setTimerDuration(state: TimerState, mode: TimerMode, minutes: number): TimerState {
  const settings = {
    ...state.settings,
    [mode === "study" ? "studyMinutes" : "restMinutes"]: minutes,
  };

  return createTimerState(settings, state.mode);
}

export function getTimerProgressRatio(state: TimerState): number {
  if (state.totalSeconds === 0) {
    return 0;
  }

  return state.remainingSeconds / state.totalSeconds;
}
