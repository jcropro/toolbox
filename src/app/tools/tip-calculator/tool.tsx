"use client";

import { useState, useCallback, useMemo } from "react";

const presetTips = [10, 15, 18, 20, 25];

export function TipCalculatorTool() {
  const [billAmount, setBillAmount] = useState("85.50");
  const [tipPercent, setTipPercent] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [numPeople, setNumPeople] = useState("2");

  const activeTip = isCustom ? parseFloat(customTip) || 0 : tipPercent;

  const results = useMemo(() => {
    const bill = parseFloat(billAmount) || 0;
    const people = Math.max(1, parseInt(numPeople) || 1);
    const tipAmount = bill * (activeTip / 100);
    const totalBill = bill + tipAmount;
    const totalPerPerson = totalBill / people;
    const tipPerPerson = tipAmount / people;

    return { bill, tipAmount, totalBill, totalPerPerson, tipPerPerson, people };
  }, [billAmount, activeTip, numPeople]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const selectPreset = useCallback((pct: number) => {
    setTipPercent(pct);
    setIsCustom(false);
  }, []);

  const handleCustom = useCallback(() => {
    setIsCustom(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Tip Calculator
      </h1>
      <p className="text-gray-600 mb-6">
        Calculate tips and split bills between any number of people. Pick a
        preset tip percentage or enter your own.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Inputs */}
        <div>
          {/* Bill amount */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill Amount ($)
            </label>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Tip percentage presets */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip Percentage
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presetTips.map((pct) => (
                <button
                  key={pct}
                  onClick={() => selectPreset(pct)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    !isCustom && tipPercent === pct
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <button
                onClick={handleCustom}
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  isCustom
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Custom
              </button>
            </div>
            {isCustom && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  min="0"
                  step="1"
                  placeholder="Enter %"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            )}
          </div>

          {/* Number of people */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Split Between
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setNumPeople(String(Math.max(1, (parseInt(numPeople) || 1) - 1)))
                }
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                min="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() =>
                  setNumPeople(String((parseInt(numPeople) || 1) + 1))
                }
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                +
              </button>
              <span className="text-sm text-gray-500">
                {results.people === 1 ? "person" : "people"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <div className="text-sm text-blue-600 font-medium">Tip Amount</div>
            <div className="text-3xl font-bold text-blue-900 mt-1">
              {fmt(results.tipAmount)}
            </div>
            <div className="text-xs text-blue-500 mt-1">
              {activeTip}% of {fmt(results.bill)}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <div className="text-sm text-green-600 font-medium">Total Bill</div>
            <div className="text-3xl font-bold text-green-900 mt-1">
              {fmt(results.totalBill)}
            </div>
          </div>

          {results.people > 1 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <div className="text-sm text-purple-600 font-medium">
                Each Person Pays
              </div>
              <div className="text-3xl font-bold text-purple-900 mt-1">
                {fmt(results.totalPerPerson)}
              </div>
              <div className="text-xs text-purple-500 mt-1">
                ({fmt(results.tipPerPerson)} tip + {fmt(results.totalPerPerson - results.tipPerPerson)} meal per person)
              </div>
            </div>
          )}

          {/* Quick comparison */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Quick Comparison
            </div>
            <div className="space-y-2">
              {presetTips.map((pct) => {
                const tip = results.bill * (pct / 100);
                const total = results.bill + tip;
                const perPerson = total / results.people;
                return (
                  <div
                    key={pct}
                    className={`flex justify-between text-sm ${
                      !isCustom && pct === tipPercent
                        ? "font-bold text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    <span>{pct}%</span>
                    <span>
                      Tip: {fmt(tip)} &middot; Total: {fmt(total)}
                      {results.people > 1 && ` (${fmt(perPerson)}/ea)`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Tipping Guidelines
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          In the United States, 15&ndash;20% is standard for restaurant dining.
          For exceptional service, 20&ndash;25% is common. Takeout and counter
          service typically warrant 10&ndash;15%. When splitting a bill, this
          calculator divides the total (including tip) evenly among all
          participants.
        </p>
      </section>
    </div>
  );
}
