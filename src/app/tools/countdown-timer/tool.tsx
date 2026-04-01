"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: number): TimeLeft | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimerTool() {
  const [eventName, setEventName] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("00:00");
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const date = params.get("date");
    const time = params.get("time");
    if (date) {
      if (name) setEventName(name);
      setTargetDate(date);
      if (time) setTargetTime(time);
      // Auto-start if params present
      const ts = new Date(`${date}T${time || "00:00"}`).getTime();
      if (!isNaN(ts) && ts > Date.now()) {
        setRunning(true);
      }
    }
  }, []);

  // Countdown tick
  useEffect(() => {
    if (!running) return;
    const ts = new Date(`${targetDate}T${targetTime}`).getTime();
    if (isNaN(ts)) {
      setRunning(false);
      return;
    }

    const tick = () => {
      const tl = calcTimeLeft(ts);
      if (tl === null) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setFinished(true);
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setTimeLeft(tl);
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, targetDate, targetTime]);

  const handleStart = useCallback(() => {
    if (!targetDate) return;
    const ts = new Date(`${targetDate}T${targetTime}`).getTime();
    if (isNaN(ts)) return;
    if (ts <= Date.now()) return;
    setFinished(false);
    setRunning(true);
  }, [targetDate, targetTime]);

  const handleReset = useCallback(() => {
    setRunning(false);
    setFinished(false);
    setTimeLeft(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleShare = useCallback(async () => {
    const params = new URLSearchParams();
    if (eventName) params.set("name", eventName);
    params.set("date", targetDate);
    params.set("time", targetTime);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [eventName, targetDate, targetTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Countdown Timer</h1>
      <p className="text-gray-600 mb-6">
        Pick a date and time, name your event, and watch the seconds tick away.
        Share the link so others can count down with you.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Setup */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Product Launch, Birthday, New Year"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Time
            </label>
            <input
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStart}
            disabled={!targetDate || running}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Countdown
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
          >
            Reset
          </button>
          {targetDate && (
            <button
              onClick={handleShare}
              className="px-5 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium cursor-pointer"
            >
              {copied ? "Link Copied!" : "Share Link"}
            </button>
          )}
        </div>
      </div>

      {/* Countdown display */}
      {timeLeft !== null && (
        <div className="text-center mb-8">
          {eventName && (
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {eventName}
            </h2>
          )}

          {finished ? (
            <div className="relative py-12">
              {/* Celebration animation */}
              <div className="celebration-container absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      backgroundColor: [
                        "#ff6b6b",
                        "#ffd93d",
                        "#6bcb77",
                        "#4d96ff",
                        "#ff6bcb",
                        "#9b59b6",
                      ][i % 6],
                    }}
                  />
                ))}
              </div>
              <p className="text-4xl font-bold text-green-600 animate-bounce">
                Time&rsquo;s Up!
              </p>
              <p className="text-gray-500 mt-2">
                The countdown has finished.
              </p>

              <style jsx>{`
                .confetti-piece {
                  width: 10px;
                  height: 10px;
                  top: -10px;
                  border-radius: 2px;
                  animation: confetti-fall 3s ease-in-out infinite;
                }
                @keyframes confetti-fall {
                  0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                  }
                  100% {
                    transform: translateY(400px) rotate(720deg);
                    opacity: 0;
                  }
                }
              `}</style>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="bg-gray-900 text-white rounded-xl p-4"
                >
                  <div className="text-4xl sm:text-5xl font-mono font-bold tabular-nums">
                    {pad(unit.value)}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 mt-2">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Countdown Timer
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Count down to birthdays, product launches, holidays, or any event you
          choose. Name your countdown, pick a date and time, and watch it tick.
          Use the share button to copy a link that anyone can open to see the
          same countdown. Everything runs in your browser &mdash; no data is
          sent anywhere.
        </p>
      </section>
    </div>
  );
}
