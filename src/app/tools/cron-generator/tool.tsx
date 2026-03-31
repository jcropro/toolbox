"use client";

import { useState, useMemo, useCallback } from "react";

interface CronField {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

interface Preset {
  label: string;
  cron: CronField;
}

const PRESETS: Preset[] = [
  { label: "Every Minute", cron: { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every 5 Minutes", cron: { minute: "*/5", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every 15 Minutes", cron: { minute: "*/15", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every 30 Minutes", cron: { minute: "*/30", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every Hour", cron: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every Day at Midnight", cron: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every Day at Noon", cron: { minute: "0", hour: "12", dayOfMonth: "*", month: "*", dayOfWeek: "*" } },
  { label: "Every Sunday at Midnight", cron: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "0" } },
  { label: "Every Weekday at 9 AM", cron: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" } },
  { label: "First Day of Month", cron: { minute: "0", hour: "0", dayOfMonth: "1", month: "*", dayOfWeek: "*" } },
  { label: "Every Monday at 8 AM", cron: { minute: "0", hour: "8", dayOfMonth: "*", month: "*", dayOfWeek: "1" } },
];

const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function describeCron(cron: CronField): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = cron;
  const parts: string[] = [];

  // Minute
  if (minute === "*") {
    parts.push("Every minute");
  } else if (minute.startsWith("*/")) {
    parts.push(`Every ${minute.slice(2)} minutes`);
  } else {
    parts.push(`At minute ${minute}`);
  }

  // Hour
  if (hour === "*") {
    if (minute !== "*" && !minute.startsWith("*/")) {
      parts.push("of every hour");
    }
  } else if (hour.startsWith("*/")) {
    parts.push(`every ${hour.slice(2)} hours`);
  } else {
    const h = parseInt(hour, 10);
    if (!isNaN(h)) {
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      // Replace the "At minute X" prefix with a time
      if (minute !== "*" && !minute.startsWith("*/")) {
        parts[0] = `At ${h12}:${minute.padStart(2, "0")} ${ampm}`;
      } else {
        parts.push(`during the ${h12} ${ampm} hour`);
      }
    } else {
      parts.push(`during hour ${hour}`);
    }
  }

  // Day of month
  if (dayOfMonth !== "*") {
    if (dayOfMonth.startsWith("*/")) {
      parts.push(`every ${dayOfMonth.slice(2)} days`);
    } else {
      parts.push(`on day ${dayOfMonth} of the month`);
    }
  }

  // Month
  if (month !== "*") {
    if (month.startsWith("*/")) {
      parts.push(`every ${month.slice(2)} months`);
    } else {
      const m = parseInt(month, 10);
      if (!isNaN(m) && m >= 1 && m <= 12) {
        parts.push(`in ${MONTH_NAMES[m]}`);
      } else {
        parts.push(`in month ${month}`);
      }
    }
  }

  // Day of week
  if (dayOfWeek !== "*") {
    if (dayOfWeek === "1-5") {
      parts.push("on weekdays (Mon-Fri)");
    } else if (dayOfWeek === "0,6") {
      parts.push("on weekends (Sat-Sun)");
    } else {
      const d = parseInt(dayOfWeek, 10);
      if (!isNaN(d) && d >= 0 && d <= 6) {
        parts.push(`on ${DAY_NAMES[d]}`);
      } else {
        parts.push(`on day-of-week ${dayOfWeek}`);
      }
    }
  }

  return parts.join(" ");
}

function getNextRuns(cron: CronField, count: number): Date[] {
  const runs: Date[] = [];
  const now = new Date();
  const check = new Date(now);
  check.setSeconds(0, 0);
  check.setMinutes(check.getMinutes() + 1);

  const maxIterations = 525600; // 1 year of minutes
  let iterations = 0;

  while (runs.length < count && iterations < maxIterations) {
    if (matchesCron(check, cron)) {
      runs.push(new Date(check));
    }
    check.setMinutes(check.getMinutes() + 1);
    iterations++;
  }

  return runs;
}

function matchesCron(date: Date, cron: CronField): boolean {
  return (
    matchesField(date.getMinutes(), cron.minute, 0, 59) &&
    matchesField(date.getHours(), cron.hour, 0, 23) &&
    matchesField(date.getDate(), cron.dayOfMonth, 1, 31) &&
    matchesField(date.getMonth() + 1, cron.month, 1, 12) &&
    matchesField(date.getDay(), cron.dayOfWeek, 0, 6)
  );
}

function matchesField(value: number, field: string, min: number, max: number): boolean {
  if (field === "*") return true;

  // Handle comma-separated values
  if (field.includes(",")) {
    return field.split(",").some((part) => matchesField(value, part.trim(), min, max));
  }

  // Handle step values
  if (field.startsWith("*/")) {
    const step = parseInt(field.slice(2), 10);
    if (isNaN(step) || step <= 0) return false;
    return value % step === 0;
  }

  // Handle ranges
  if (field.includes("-")) {
    const [startStr, endStr] = field.split("-");
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    if (isNaN(start) || isNaN(end)) return false;
    return value >= start && value <= end;
  }

  // Handle step with range (e.g., 1-5/2)
  if (field.includes("/")) {
    const [rangeStr, stepStr] = field.split("/");
    const step = parseInt(stepStr, 10);
    if (isNaN(step) || step <= 0) return false;
    if (rangeStr === "*") return value % step === 0;
    const rangeStart = parseInt(rangeStr, 10);
    if (isNaN(rangeStart)) return false;
    return value >= rangeStart && (value - rangeStart) % step === 0;
  }

  // Exact match
  const exact = parseInt(field, 10);
  return !isNaN(exact) && value === exact;
}

export function CronGeneratorTool() {
  const [cron, setCron] = useState<CronField>({
    minute: "0",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });
  const [copied, setCopied] = useState(false);

  const expression = useMemo(
    () => `${cron.minute} ${cron.hour} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`,
    [cron]
  );

  const description = useMemo(() => describeCron(cron), [cron]);

  const nextRuns = useMemo(() => getNextRuns(cron, 5), [cron]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(expression);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = expression;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [expression]);

  const updateField = (field: keyof CronField, value: string) => {
    setCron((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cron Expression Generator</h1>
      <p className="text-gray-600 mb-6">
        Build cron expressions visually with a point-and-click interface. See a plain English
        explanation and the next 5 scheduled run times. Pick from presets or customize each field.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Result display */}
      <div className="bg-gray-900 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Cron Expression</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-medium bg-gray-700 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="font-mono text-2xl sm:text-3xl tracking-widest mb-3">{expression}</p>
        <p className="text-sm text-gray-300">{description}</p>
      </div>

      {/* Presets */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Presets</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setCron(preset.cron)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors cursor-pointer ${
                expression === `${preset.cron.minute} ${preset.cron.hour} ${preset.cron.dayOfMonth} ${preset.cron.month} ${preset.cron.dayOfWeek}`
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Field editors */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customize Fields</h2>
        <div className="space-y-4">
          {/* Minute */}
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Minute</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={
                  cron.minute === "*" ? "*" :
                  cron.minute.startsWith("*/") ? "step" : "specific"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "*") updateField("minute", "*");
                  else if (v === "step") updateField("minute", "*/5");
                  else updateField("minute", "0");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="*">Every minute</option>
                <option value="step">Every N minutes</option>
                <option value="specific">Specific minute</option>
              </select>
              {cron.minute !== "*" && (
                <input
                  type="text"
                  value={cron.minute}
                  onChange={(e) => updateField("minute", e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-59"
                />
              )}
            </div>
          </div>

          {/* Hour */}
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Hour</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={
                  cron.hour === "*" ? "*" :
                  cron.hour.startsWith("*/") ? "step" : "specific"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "*") updateField("hour", "*");
                  else if (v === "step") updateField("hour", "*/2");
                  else updateField("hour", "0");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="*">Every hour</option>
                <option value="step">Every N hours</option>
                <option value="specific">Specific hour</option>
              </select>
              {cron.hour !== "*" && (
                <input
                  type="text"
                  value={cron.hour}
                  onChange={(e) => updateField("hour", e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-23"
                />
              )}
            </div>
          </div>

          {/* Day of Month */}
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Day of Month</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={
                  cron.dayOfMonth === "*" ? "*" :
                  cron.dayOfMonth.startsWith("*/") ? "step" : "specific"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "*") updateField("dayOfMonth", "*");
                  else if (v === "step") updateField("dayOfMonth", "*/2");
                  else updateField("dayOfMonth", "1");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="*">Every day</option>
                <option value="step">Every N days</option>
                <option value="specific">Specific day</option>
              </select>
              {cron.dayOfMonth !== "*" && (
                <input
                  type="text"
                  value={cron.dayOfMonth}
                  onChange={(e) => updateField("dayOfMonth", e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1-31"
                />
              )}
            </div>
          </div>

          {/* Month */}
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Month</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={
                  cron.month === "*" ? "*" :
                  cron.month.startsWith("*/") ? "step" : "specific"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "*") updateField("month", "*");
                  else if (v === "step") updateField("month", "*/2");
                  else updateField("month", "1");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="*">Every month</option>
                <option value="step">Every N months</option>
                <option value="specific">Specific month</option>
              </select>
              {cron.month !== "*" && cron.month !== "step" && (
                <input
                  type="text"
                  value={cron.month}
                  onChange={(e) => updateField("month", e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1-12"
                />
              )}
            </div>
          </div>

          {/* Day of Week */}
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Day of Week</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={
                  cron.dayOfWeek === "*" ? "*" :
                  cron.dayOfWeek === "1-5" ? "weekdays" :
                  cron.dayOfWeek === "0,6" ? "weekends" : "specific"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "*") updateField("dayOfWeek", "*");
                  else if (v === "weekdays") updateField("dayOfWeek", "1-5");
                  else if (v === "weekends") updateField("dayOfWeek", "0,6");
                  else updateField("dayOfWeek", "0");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="*">Every day</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekends">Weekends (Sat-Sun)</option>
                <option value="specific">Specific day</option>
              </select>
              {cron.dayOfWeek !== "*" && cron.dayOfWeek !== "1-5" && cron.dayOfWeek !== "0,6" && (
                <select
                  value={cron.dayOfWeek}
                  onChange={(e) => updateField("dayOfWeek", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {DAY_NAMES.map((name, i) => (
                    <option key={i} value={i.toString()}>{name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Manual input */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Or type directly</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => {
              const parts = e.target.value.split(/\s+/);
              if (parts.length === 5) {
                setCron({
                  minute: parts[0],
                  hour: parts[1],
                  dayOfMonth: parts[2],
                  month: parts[3],
                  dayOfWeek: parts[4],
                });
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="* * * * *"
          />
          <p className="text-xs text-gray-400 mt-1">
            Format: minute hour day-of-month month day-of-week
          </p>
        </div>
      </div>

      {/* Next runs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Next 5 Run Times</h2>
        {nextRuns.length > 0 ? (
          <div className="space-y-2">
            {nextRuns.map((run, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <span className="text-xs font-mono text-gray-400 w-6 text-right">{i + 1}.</span>
                <span className="text-sm font-medium text-gray-900">
                  {run.toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-sm text-gray-500">
                  {run.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No upcoming runs found in the next year. Check your expression.
          </p>
        )}
      </div>

      {/* Reference */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Cron Syntax Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2 pr-4 text-gray-600 font-medium">Field</th>
                <th className="py-2 pr-4 text-gray-600 font-medium">Range</th>
                <th className="py-2 text-gray-600 font-medium">Special Chars</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Minute</td>
                <td className="py-2 pr-4">0-59</td>
                <td className="py-2">* , - /</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Hour</td>
                <td className="py-2 pr-4">0-23</td>
                <td className="py-2">* , - /</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Day of Month</td>
                <td className="py-2 pr-4">1-31</td>
                <td className="py-2">* , - /</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Month</td>
                <td className="py-2 pr-4">1-12</td>
                <td className="py-2">* , - /</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Day of Week</td>
                <td className="py-2 pr-4">0-6 (Sun=0)</td>
                <td className="py-2">* , - /</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About Cron Expressions</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Cron expressions are used to schedule recurring tasks on Unix-like systems. A standard
          cron expression has five fields: minute, hour, day of month, month, and day of week.
          Each field can use wildcards (*), ranges (1-5), lists (1,3,5), and step values (*/15).
          This tool builds the expression visually, explains it in plain English, and calculates
          the next scheduled run times. All computation happens locally in your browser.
        </p>
      </section>
    </div>
  );
}
