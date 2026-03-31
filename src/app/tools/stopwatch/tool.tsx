"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Lap {
  lapNumber: number;
  splitTime: number;
  totalTime: number;
}

function formatTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  const cs = centiseconds.toString().padStart(2, "0");

  return `${hh}:${mm}:${ss}.${cs}`;
}

export function StopwatchTool() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  const tick = useCallback(() => {
    setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current));
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(tick, 10);
    setRunning(true);
  }, [tick]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    accumulatedRef.current += Date.now() - startTimeRef.current;
    setElapsed(accumulatedRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    accumulatedRef.current = 0;
    startTimeRef.current = 0;
    setElapsed(0);
    setRunning(false);
    setLaps([]);
  }, []);

  const recordLap = useCallback(() => {
    const currentTotal = accumulatedRef.current + (Date.now() - startTimeRef.current);
    const prevTotal = laps.length > 0 ? laps[0].totalTime : 0;
    const splitTime = currentTotal - prevTotal;

    setLaps((prev) => [
      {
        lapNumber: prev.length + 1,
        splitTime,
        totalTime: currentTotal,
      },
      ...prev,
    ]);
  }, [laps]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const bestLap = laps.length > 1 ? Math.min(...laps.map((l) => l.splitTime)) : null;
  const worstLap = laps.length > 1 ? Math.max(...laps.map((l) => l.splitTime)) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Online Stopwatch</h1>
      <p className="text-gray-600 mb-6">
        A precise online stopwatch with lap timing. Start, stop, and record split times for
        workouts, races, or any timing need.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
        <div className="text-center mb-8">
          <div className="font-mono text-6xl md:text-7xl font-bold text-gray-900 tracking-wider mb-8 select-none">
            {formatTime(elapsed)}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            {!running ? (
              <button
                onClick={start}
                className="bg-green-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors min-w-[120px]"
              >
                {elapsed > 0 ? "Resume" : "Start"}
              </button>
            ) : (
              <button
                onClick={stop}
                className="bg-red-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-red-700 transition-colors min-w-[120px]"
              >
                Stop
              </button>
            )}

            {running && (
              <button
                onClick={recordLap}
                className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors min-w-[120px]"
              >
                Lap
              </button>
            )}

            {!running && elapsed > 0 && (
              <button
                onClick={reset}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-300 transition-colors min-w-[120px]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {laps.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Laps ({laps.length})</h2>
            <div className="overflow-auto max-h-[400px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 px-3 font-medium text-gray-600">Lap</th>
                    <th className="py-2 px-3 font-medium text-gray-600">Split Time</th>
                    <th className="py-2 px-3 font-medium text-gray-600">Total Time</th>
                  </tr>
                </thead>
                <tbody>
                  {laps.map((lap) => {
                    let rowClass = "";
                    if (laps.length > 1) {
                      if (lap.splitTime === bestLap) rowClass = "text-green-700 bg-green-50";
                      else if (lap.splitTime === worstLap) rowClass = "text-red-700 bg-red-50";
                    }
                    return (
                      <tr key={lap.lapNumber} className={`border-b border-gray-100 ${rowClass}`}>
                        <td className="py-2 px-3 font-mono">#{lap.lapNumber}</td>
                        <td className="py-2 px-3 font-mono">{formatTime(lap.splitTime)}</td>
                        <td className="py-2 px-3 font-mono">{formatTime(lap.totalTime)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {laps.length > 1 && (
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Best split
                </span>
                <span>
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Worst split
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
