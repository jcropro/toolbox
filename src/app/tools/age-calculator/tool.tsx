"use client";

import { useState, useCallback } from "react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  dayOfWeek: string;
  daysUntilBirthday: number;
  nextBirthdayDay: string;
  zodiac: string;
  zodiacSymbol: string;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getZodiac(month: number, day: number): { sign: string; symbol: string } {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return { sign: "Aries", symbol: "\u2648" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return { sign: "Taurus", symbol: "\u2649" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return { sign: "Gemini", symbol: "\u264A" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return { sign: "Cancer", symbol: "\u264B" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
    return { sign: "Leo", symbol: "\u264C" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return { sign: "Virgo", symbol: "\u264D" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return { sign: "Libra", symbol: "\u264E" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return { sign: "Scorpio", symbol: "\u264F" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return { sign: "Sagittarius", symbol: "\u2650" };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return { sign: "Capricorn", symbol: "\u2651" };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return { sign: "Aquarius", symbol: "\u2652" };
  return { sign: "Pisces", symbol: "\u2653" };
}

export function AgeCalculatorTool() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  const calculate = useCallback(() => {
    setError("");
    setResult(null);

    if (!dob) {
      setError("Please select your date of birth.");
      return;
    }

    const birthDate = new Date(dob + "T00:00:00");
    const now = new Date();

    if (birthDate > now) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    // Calculate exact age
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Total days lived
    const msPerDay = 86400000;
    const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / msPerDay);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Day of week born
    const dayOfWeek = daysOfWeek[birthDate.getDay()];

    // Days until next birthday
    let nextBirthday = new Date(
      now.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    if (nextBirthday <= now) {
      nextBirthday = new Date(
        now.getFullYear() + 1,
        birthDate.getMonth(),
        birthDate.getDate()
      );
    }
    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - now.getTime()) / msPerDay
    );
    const nextBirthdayDay = daysOfWeek[nextBirthday.getDay()];

    // Zodiac
    const zodiac = getZodiac(birthDate.getMonth() + 1, birthDate.getDate());

    setResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      dayOfWeek,
      daysUntilBirthday,
      nextBirthdayDay,
      zodiac: zodiac.sign,
      zodiacSymbol: zodiac.symbol,
    });
  }, [dob]);

  const fmtNum = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Age Calculator
      </h1>
      <p className="text-gray-600 mb-6">
        Enter your date of birth to see your exact age, zodiac sign, day of the
        week you were born, and how many days until your next birthday.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Input */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={calculate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
        >
          Calculate Age
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-800 border border-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Main age display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="text-sm text-blue-600 font-medium mb-2">
              Your Age
            </div>
            <div className="flex justify-center gap-6 flex-wrap">
              <div>
                <span className="text-4xl font-bold text-blue-900">
                  {result.years}
                </span>
                <span className="text-lg text-blue-600 ml-1">
                  {result.years === 1 ? "year" : "years"}
                </span>
              </div>
              <div>
                <span className="text-4xl font-bold text-blue-900">
                  {result.months}
                </span>
                <span className="text-lg text-blue-600 ml-1">
                  {result.months === 1 ? "month" : "months"}
                </span>
              </div>
              <div>
                <span className="text-4xl font-bold text-blue-900">
                  {result.days}
                </span>
                <span className="text-lg text-blue-600 ml-1">
                  {result.days === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Born on</div>
              <div className="text-lg font-semibold text-gray-900">
                {result.dayOfWeek}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Next Birthday</div>
              <div className="text-lg font-semibold text-gray-900">
                {result.daysUntilBirthday === 0
                  ? "Today!"
                  : `${fmtNum(result.daysUntilBirthday)} days away`}
              </div>
              <div className="text-xs text-gray-400">
                Falls on a {result.nextBirthdayDay}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Zodiac Sign</div>
              <div className="text-lg font-semibold text-gray-900">
                {result.zodiacSymbol} {result.zodiac}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Days Lived</div>
              <div className="text-lg font-semibold text-gray-900">
                {fmtNum(result.totalDays)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Hours Lived</div>
              <div className="text-lg font-semibold text-gray-900">
                {fmtNum(result.totalHours)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Minutes Lived</div>
              <div className="text-lg font-semibold text-gray-900">
                {fmtNum(result.totalMinutes)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Calculator
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          This age calculator determines your exact age down to the day by
          accounting for varying month lengths and leap years. It also shows fun
          stats like your total days lived and your Western zodiac sign based on
          your birth date. All calculations run locally in your browser.
        </p>
      </section>
    </div>
  );
}
