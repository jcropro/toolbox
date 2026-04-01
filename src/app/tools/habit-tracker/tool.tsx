"use client";

import { useState, useEffect, useCallback } from "react";

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T12:00:00");
    const curr = new Date(sorted[i] + "T12:00:00");
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diff) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

const STORAGE_KEY = "habit-tracker-data";

export function HabitTrackerTool() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [loaded, setLoaded] = useState(false);

  const weekDates = getWeekDates();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHabits(JSON.parse(stored));
      }
    } catch {}
    setLoaded(true);
  }, []);

  const persist = useCallback((updated: Habit[]) => {
    setHabits(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const addHabit = () => {
    const name = newHabitName.trim();
    if (!name) return;
    const habit: Habit = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      completedDates: [],
    };
    persist([...habits, habit]);
    setNewHabitName("");
  };

  const removeHabit = (id: string) => {
    persist(habits.filter((h) => h.id !== id));
  };

  const toggleDay = (habitId: string, date: string) => {
    persist(
      habits.map((h) => {
        if (h.id !== habitId) return h;
        const has = h.completedDates.includes(date);
        return {
          ...h,
          completedDates: has
            ? h.completedDates.filter((d) => d !== date)
            : [...h.completedDates, date],
        };
      })
    );
  };

  const weekCompletionRate = (habit: Habit): number => {
    const completed = weekDates.filter((d) => habit.completedDates.includes(d)).length;
    return Math.round((completed / 7) * 100);
  };

  if (!loaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Habit Tracker</h1>
      <p className="text-gray-600 mb-6">
        Track your daily habits with a simple weekly grid. Check off completed days, view your
        streaks, and build consistency. Your data is saved locally in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Add Habit */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          placeholder="Enter a new habit (e.g. Exercise, Read, Meditate)"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={addHabit}
          disabled={!newHabitName.trim()}
          className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg mb-1">No habits yet</p>
          <p className="text-sm">Add your first habit above to start tracking.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[160px]">
                  Habit
                </th>
                {weekDates.map((date) => (
                  <th
                    key={date}
                    className={`py-3 px-2 text-center font-medium min-w-[60px] ${
                      date === today ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    <div>{formatDay(date)}</div>
                    <div className="text-xs font-normal text-gray-400">{formatDate(date)}</div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center font-medium text-gray-700">Streak</th>
                <th className="py-3 px-3 text-center font-medium text-gray-700">Week</th>
                <th className="py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => {
                const streak = getStreak(habit.completedDates);
                const rate = weekCompletionRate(habit);
                return (
                  <tr key={habit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{habit.name}</td>
                    {weekDates.map((date) => {
                      const done = habit.completedDates.includes(date);
                      const isToday = date === today;
                      return (
                        <td key={date} className="py-3 px-2 text-center">
                          <button
                            onClick={() => toggleDay(habit.id, date)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition ${
                              done
                                ? "bg-green-500 text-white shadow-sm"
                                : isToday
                                ? "bg-blue-50 border-2 border-blue-300 text-blue-300 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            {done ? "\u2713" : ""}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-3 px-3 text-center">
                      {streak > 0 ? (
                        <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                          {streak}d
                        </span>
                      ) : (
                        <span className="text-gray-300">0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-xs font-medium ${
                          rate >= 80
                            ? "text-green-600"
                            : rate >= 50
                            ? "text-yellow-600"
                            : "text-gray-400"
                        }`}
                      >
                        {rate}%
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => removeHabit(habit.id)}
                        className="text-gray-400 hover:text-red-500 text-sm transition"
                        title="Remove habit"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
