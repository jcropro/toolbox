"use client";

import { useState, useCallback } from "react";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function LoanCalculatorTool() {
  const [loanAmount, setLoanAmount] = useState("250000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    amortization: AmortizationRow[];
  } | null>(null);
  const [showFullTable, setShowFullTable] = useState(false);

  const calculate = useCallback(() => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const term = parseFloat(loanTerm);

    if (isNaN(P) || isNaN(annualRate) || isNaN(term) || P <= 0 || annualRate < 0 || term <= 0) {
      setResult(null);
      return;
    }

    const totalMonths = termUnit === "years" ? term * 12 : term;
    const monthlyRate = annualRate / 100 / 12;

    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = P / totalMonths;
    } else {
      monthlyPayment =
        (P * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - P;

    const amortization: AmortizationRow[] = [];
    let balance = P;
    for (let m = 1; m <= totalMonths; m++) {
      const interestPortion = balance * monthlyRate;
      const principalPortion = monthlyPayment - interestPortion;
      balance = Math.max(0, balance - principalPortion);
      amortization.push({
        month: m,
        payment: monthlyPayment,
        principal: principalPortion,
        interest: interestPortion,
        balance,
      });
    }

    setResult({ monthlyPayment, totalPayment, totalInterest, amortization });
    setShowFullTable(false);
  }, [loanAmount, interestRate, loanTerm, termUnit]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const principalPercent = result
    ? (parseFloat(loanAmount) / result.totalPayment) * 100
    : 0;
  const interestPercent = result ? 100 - principalPercent : 0;

  const displayRows = result
    ? showFullTable
      ? result.amortization
      : result.amortization.slice(0, 24)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Loan &amp; Mortgage Calculator
      </h1>
      <p className="text-gray-600 mb-6">
        Calculate your monthly payment, total interest, and view a full
        amortization schedule. All math runs in your browser &mdash; nothing is
        sent to a server.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount ($)
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            min="0"
            step="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate (%)
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
            Loan Term
          </label>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            min="1"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Term Unit
          </label>
          <select
            value={termUnit}
            onChange={(e) => setTermUnit(e.target.value as "years" | "months")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="years">Years</option>
            <option value="months">Months</option>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-600 font-medium">Monthly Payment</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {fmt(result.monthlyPayment)}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-sm text-green-600 font-medium">Total Payment</div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                {fmt(result.totalPayment)}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-sm text-orange-600 font-medium">Total Interest</div>
              <div className="text-2xl font-bold text-orange-900 mt-1">
                {fmt(result.totalInterest)}
              </div>
            </div>
          </div>

          {/* Principal vs Interest bar */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Principal vs Interest Breakdown
            </h2>
            <div className="w-full h-8 rounded-full overflow-hidden flex bg-gray-200">
              <div
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${principalPercent}%` }}
              />
              <div
                className="bg-orange-400 h-full transition-all"
                style={{ width: `${interestPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-blue-700 font-medium">
                Principal: {fmt(parseFloat(loanAmount))} ({principalPercent.toFixed(1)}%)
              </span>
              <span className="text-orange-700 font-medium">
                Interest: {fmt(result.totalInterest)} ({interestPercent.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Amortization Table */}
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Amortization Schedule
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Month</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Payment</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Principal</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Interest</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Balance</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row) => (
                  <tr key={row.month} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{row.month}</td>
                    <td className="px-4 py-2 text-right text-gray-800">{fmt(row.payment)}</td>
                    <td className="px-4 py-2 text-right text-blue-700">{fmt(row.principal)}</td>
                    <td className="px-4 py-2 text-right text-orange-700">{fmt(row.interest)}</td>
                    <td className="px-4 py-2 text-right text-gray-800">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.amortization.length > 24 && !showFullTable && (
            <button
              onClick={() => setShowFullTable(true)}
              className="mt-3 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium cursor-pointer"
            >
              Show all {result.amortization.length} months
            </button>
          )}
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          How Loan Payments Are Calculated
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          This calculator uses the standard amortization formula to determine
          your fixed monthly payment. Each month, a portion goes toward interest
          on the remaining balance while the rest reduces your principal. Early
          in the loan, most of your payment covers interest; over time the split
          shifts toward principal. The amortization table above shows this
          breakdown month by month.
        </p>
      </section>
    </div>
  );
}
