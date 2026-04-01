"use client";

import { useState, useCallback } from "react";

type CompoundFrequency = "daily" | "monthly" | "quarterly" | "annually";

interface YearRow {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
}

const frequencyLabels: Record<CompoundFrequency, string> = {
  daily: "Daily (365/yr)",
  monthly: "Monthly (12/yr)",
  quarterly: "Quarterly (4/yr)",
  annually: "Annually (1/yr)",
};

const frequencyPeriods: Record<CompoundFrequency, number> = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  annually: 1,
};

export function CompoundInterestTool() {
  const [principal, setPrincipal] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [interestRate, setInterestRate] = useState("7");
  const [years, setYears] = useState("20");
  const [frequency, setFrequency] = useState<CompoundFrequency>("monthly");
  const [result, setResult] = useState<{
    finalAmount: number;
    totalContributions: number;
    totalInterest: number;
    breakdown: YearRow[];
  } | null>(null);

  const calculate = useCallback(() => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const r = (parseFloat(interestRate) || 0) / 100;
    const t = parseInt(years) || 0;
    const n = frequencyPeriods[frequency];

    if (t <= 0) {
      setResult(null);
      return;
    }

    const breakdown: YearRow[] = [];
    let balance = P;
    let totalContributed = P;
    const ratePerPeriod = r / n;

    for (let y = 1; y <= t; y++) {
      const startBalance = balance;
      const startContributed = totalContributed;

      // Simulate each compounding period within the year
      const periodsPerYear = n;
      const contributionPerPeriod = (PMT * 12) / n;

      for (let p = 0; p < periodsPerYear; p++) {
        const interest = balance * ratePerPeriod;
        balance += interest + contributionPerPeriod;
        totalContributed += contributionPerPeriod;
      }

      const yearInterest = balance - startBalance - (totalContributed - startContributed);

      breakdown.push({
        year: y,
        contributions: totalContributed,
        interest: balance - totalContributed,
        balance,
      });
    }

    const totalInterest = balance - totalContributed;

    setResult({
      finalAmount: balance,
      totalContributions: totalContributed,
      totalInterest,
      breakdown,
    });
  }, [principal, monthlyContribution, interestRate, years, frequency]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const fmtFull = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Proportions for the visual bar
  const contribPercent = result
    ? (result.totalContributions / result.finalAmount) * 100
    : 0;
  const interestPercent = result ? 100 - contribPercent : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Compound Interest Calculator
      </h1>
      <p className="text-gray-600 mb-6">
        See how your investments grow over time with compound interest and
        regular contributions. All calculations happen in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Investment ($)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            min="0"
            step="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Contribution ($)
          </label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            min="0"
            step="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Period (Years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            min="1"
            max="100"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compounding Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as CompoundFrequency)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(Object.keys(frequencyLabels) as CompoundFrequency[]).map((f) => (
              <option key={f} value={f}>
                {frequencyLabels[f]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
      >
        Calculate
      </button>

      {/* Results */}
      {result && (
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-sm text-green-600 font-medium">
                Final Balance
              </div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                {fmt(result.finalAmount)}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-600 font-medium">
                Total Contributions
              </div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {fmt(result.totalContributions)}
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-sm text-purple-600 font-medium">
                Total Interest Earned
              </div>
              <div className="text-2xl font-bold text-purple-900 mt-1">
                {fmt(result.totalInterest)}
              </div>
            </div>
          </div>

          {/* Contributions vs Interest bar */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Contributions vs Interest
            </h2>
            <div className="w-full h-8 rounded-full overflow-hidden flex bg-gray-200">
              <div
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${contribPercent}%` }}
              />
              <div
                className="bg-purple-500 h-full transition-all"
                style={{ width: `${interestPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-blue-700 font-medium">
                Contributions: {fmt(result.totalContributions)} (
                {contribPercent.toFixed(1)}%)
              </span>
              <span className="text-purple-700 font-medium">
                Interest: {fmt(result.totalInterest)} ({interestPercent.toFixed(1)}
                %)
              </span>
            </div>
          </div>

          {/* Year-by-year table */}
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Year-by-Year Breakdown
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Year
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">
                    Total Contributions
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">
                    Total Interest
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map((row) => {
                  const barWidth =
                    result.finalAmount > 0
                      ? (row.balance / result.finalAmount) * 100
                      : 0;
                  return (
                    <tr
                      key={row.year}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 text-gray-800">{row.year}</td>
                      <td className="px-4 py-2 text-right text-blue-700">
                        {fmtFull(row.contributions)}
                      </td>
                      <td className="px-4 py-2 text-right text-purple-700">
                        {fmtFull(row.interest)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-gray-800 font-medium">
                            {fmtFull(row.balance)}
                          </span>
                          <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Understanding Compound Interest
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Compound interest earns returns on both your original investment and
          on previously accumulated interest. The more frequently interest
          compounds, the faster your money grows. Even small monthly
          contributions can add up dramatically over decades thanks to this
          snowball effect. This calculator models real-world compounding by
          applying contributions and interest at each compounding interval.
        </p>
      </section>
    </div>
  );
}
