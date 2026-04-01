"use client";

import { useState, useMemo } from "react";

type Frequency = "hourly" | "weekly" | "biweekly" | "monthly" | "annual";

const FREQUENCY_LABELS: Record<Frequency, string> = {
  hourly: "Hourly",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  annual: "Annual",
};

// Hours: 40/week, 52 weeks/year, 26 biweekly periods, 12 months
const TO_ANNUAL: Record<Frequency, number> = {
  hourly: 2080,
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  annual: 1,
};

const FROM_ANNUAL: Record<Frequency, number> = {
  hourly: 1 / 2080,
  weekly: 1 / 52,
  biweekly: 1 / 26,
  monthly: 1 / 12,
  annual: 1,
};

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SalaryCalculatorTool() {
  const [amount, setAmount] = useState<string>("50000");
  const [frequency, setFrequency] = useState<Frequency>("annual");
  const [fedTax, setFedTax] = useState<string>("22");
  const [stateTax, setStateTax] = useState<string>("5");
  const [retirement, setRetirement] = useState<string>("6");
  const [healthIns, setHealthIns] = useState<string>("200");

  const results = useMemo(() => {
    const val = parseFloat(amount) || 0;
    const annualGross = val * TO_ANNUAL[frequency];

    const fedRate = (parseFloat(fedTax) || 0) / 100;
    const stateRate = (parseFloat(stateTax) || 0) / 100;
    const retirementRate = (parseFloat(retirement) || 0) / 100;
    const healthMonthly = parseFloat(healthIns) || 0;

    const annualFed = annualGross * fedRate;
    const annualState = annualGross * stateRate;
    const annualRetirement = annualGross * retirementRate;
    const annualHealth = healthMonthly * 12;
    const totalDeductions = annualFed + annualState + annualRetirement + annualHealth;
    const annualNet = annualGross - totalDeductions;

    const freqs: Frequency[] = ["hourly", "weekly", "biweekly", "monthly", "annual"];
    const rows = freqs.map((f) => ({
      label: FREQUENCY_LABELS[f],
      gross: annualGross * FROM_ANNUAL[f],
      net: annualNet * FROM_ANNUAL[f],
    }));

    return {
      rows,
      annualGross,
      annualNet,
      annualFed,
      annualState,
      annualRetirement,
      annualHealth,
      totalDeductions,
      effectiveRate:
        annualGross > 0 ? (totalDeductions / annualGross) * 100 : 0,
    };
  }, [amount, frequency, fedTax, stateTax, retirement, healthIns]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Salary Calculator</h1>
      <p className="text-gray-600 mb-6">
        Convert between hourly, weekly, biweekly, monthly, and annual salary.
        Estimate your take-home pay after taxes, 401(k), and health insurance
        deductions.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold px-2">
              Salary Input
            </legend>
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Frequency
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.keys(FREQUENCY_LABELS) as Frequency[]
                  ).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                        frequency === f
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {FREQUENCY_LABELS[f]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold px-2">Deductions</legend>
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Federal Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={fedTax}
                  onChange={(e) => setFedTax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={stateTax}
                  onChange={(e) => setStateTax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  401(k) Contribution (%)
                </label>
                <input
                  type="number"
                  value={retirement}
                  onChange={(e) => setRetirement(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Health Insurance ($/month)
                </label>
                <input
                  type="number"
                  value={healthIns}
                  onChange={(e) => setHealthIns(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Deduction Breakdown */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">
              Annual Deduction Breakdown
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Annual</span>
                <span className="font-medium">
                  {fmt(results.annualGross)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-red-600">
                <span>Federal Tax</span>
                <span>-{fmt(results.annualFed)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>State Tax</span>
                <span>-{fmt(results.annualState)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>401(k)</span>
                <span>-{fmt(results.annualRetirement)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Health Insurance</span>
                <span>-{fmt(results.annualHealth)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-base">
                <span>Net Annual</span>
                <span className="text-green-700">
                  {fmt(results.annualNet)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500 text-xs">
                <span>Effective deduction rate</span>
                <span>{results.effectiveRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Conversion Table */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Pay Period Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left px-3 py-2 border border-gray-200">
                      Period
                    </th>
                    <th className="text-right px-3 py-2 border border-gray-200">
                      Gross
                    </th>
                    <th className="text-right px-3 py-2 border border-gray-200">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row) => (
                    <tr key={row.label} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-medium">
                        {row.label}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-right font-mono">
                        {fmt(row.gross)}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-right font-mono text-green-700">
                        {fmt(row.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
