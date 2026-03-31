"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type TimerPhase = "work" | "break" | "longBreak";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function playNotification() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Three-tone notification
    const tones = [523.25, 659.25, 783.99]; // C5, E5, G5
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      const start = now + i * 0.2;
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
      osc.start(start);
      osc.stop(start + 0.3);
    });

    setTimeout(() => ctx.close(), 1500);
  } catch {
    // Web Audio not available
  }
}

const PHASE_CONFIG: Record<TimerPhase, { label: string; color: string; bgColor: string; ringColor: string }> = {
  work: {
    label: "Work",
    color: "text-red-600",
    bgColor: "bg-red-50",
    ringColor: "stroke-red-500",
  },
  break: {
    label: "Break",
    color: "text-green-600",
    bgColor: "bg-green-50",
    ringColor: "stroke-green-500",
  },
  longBreak: {
    label: "Long Break",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    ringColor: "stroke-blue-500",
  },
};

export function PomodoroTimerTool() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

  const [phase, setPhase] = useState<TimerPhase>("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds =
    phase === "work"
      ? workMinutes * 60
      : phase === "break"
      ? breakMinutes * 60
      : longBreakMinutes * 60;

  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;

  const startNextPhase = useCallback(
    (currentPhase: TimerPhase, sessions: number) => {
      if (currentPhase === "work") {
        const newSessions = sessions + 1;
        setCompletedSessions(newSessions);
        if (newSessions % sessionsBeforeLongBreak === 0) {
          setPhase("longBreak");
          setSecondsLeft(longBreakMinutes * 60);
        } else {
          setPhase("break");
          setSecondsLeft(breakMinutes * 60);
        }
      } else {
        setPhase("work");
        setSecondsLeft(workMinutes * 60);
      }
      setIsRunning(false);
    },
    [workMinutes, breakMinutes, longBreakMinutes, sessionsBeforeLongBreak]
  );

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            playNotification();
            // Use functional updates via a timeout to avoid stale closures
            setTimeout(() => {
              startNextPhase(phase, completedSessions);
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phase, completedSessions, startNextPhase]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setPhase("work");
    setSecondsLeft(workMinutes * 60);
    setCompletedSessions(0);
  };

  const handleSkip = () => {
    setIsRunning(false);
    startNextPhase(phase, completedSessions);
  };

  // Update timer when durations change (only when not running)
  useEffect(() => {
    if (!isRunning) {
      if (phase === "work") setSecondsLeft(workMinutes * 60);
      else if (phase === "break") setSecondsLeft(breakMinutes * 60);
      else setSecondsLeft(longBreakMinutes * 60);
    }
  }, [workMinutes, breakMinutes, longBreakMinutes, phase, isRunning]);

  const config = PHASE_CONFIG[phase];

  // SVG circle progress
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pomodoro Timer</h1>
      <p className="text-gray-600 mb-6">
        Stay focused with the Pomodoro Technique. Work in focused sprints, take
        short breaks, and earn a long break after every few sessions. Audio
        notification plays when each phase ends.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Timer Display */}
      <div className={`${config.bgColor} rounded-2xl p-8 mb-6 flex flex-col items-center`}>
        {/* Phase indicator */}
        <div className="flex gap-2 mb-6">
          {(["work", "break", "longBreak"] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                if (!isRunning) {
                  setPhase(p);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                phase === p
                  ? `${PHASE_CONFIG[p].color} bg-white shadow-sm`
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {PHASE_CONFIG[p].label}
            </button>
          ))}
        </div>

        {/* Progress circle */}
        <div className="relative w-56 h-56 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-200"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className={config.ringColor}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: "stroke-dashoffset 0.5s ease",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-mono font-bold ${config.color}`}>
              {formatTime(secondsLeft)}
            </span>
            <span className="text-sm text-gray-500 mt-1">{config.label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-base cursor-pointer"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-base cursor-pointer"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleSkip}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm border border-gray-200 cursor-pointer"
          >
            Skip
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm border border-gray-200 cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Session counter */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm text-gray-600">Sessions completed:</span>
          <div className="flex gap-1.5">
            {Array.from({ length: sessionsBeforeLongBreak }).map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < completedSessions % sessionsBeforeLongBreak ||
                  (completedSessions > 0 &&
                    completedSessions % sessionsBeforeLongBreak === 0 &&
                    phase !== "work")
                    ? "bg-red-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-gray-800">
            {completedSessions}
          </span>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Work (min)
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={workMinutes}
              onChange={(e) =>
                setWorkMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              disabled={isRunning}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Break (min)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={breakMinutes}
              onChange={(e) =>
                setBreakMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              disabled={isRunning}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Long Break (min)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={longBreakMinutes}
              onChange={(e) =>
                setLongBreakMinutes(
                  Math.max(1, parseInt(e.target.value, 10) || 1)
                )
              }
              disabled={isRunning}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sessions until long break
            </label>
            <input
              type="number"
              min={2}
              max={10}
              value={sessionsBeforeLongBreak}
              onChange={(e) =>
                setSessionsBeforeLongBreak(
                  Math.max(2, Math.min(10, parseInt(e.target.value, 10) || 4))
                )
              }
              disabled={isRunning}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About the Pomodoro Technique
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          The Pomodoro Technique is a time management method developed by
          Francesco Cirillo. Work in focused 25-minute intervals (called
          &ldquo;pomodoros&rdquo;), take a 5-minute break between each, and
          after four sessions, take a longer 15-minute break. This tool lets you
          customize all durations and tracks your completed sessions. An audio
          notification plays when each phase ends so you can stay focused
          without watching the clock.
        </p>
      </section>
    </div>
  );
}
