"use client";

import { useState, useCallback, useMemo } from "react";

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
}

const PRESETS: { name: string; watts: number; hoursPerDay: number }[] = [
  { name: "Refrigerator", watts: 150, hoursPerDay: 24 },
  { name: "Air Conditioner (Window)", watts: 1200, hoursPerDay: 8 },
  { name: "Central AC", watts: 3500, hoursPerDay: 8 },
  { name: "Space Heater", watts: 1500, hoursPerDay: 6 },
  { name: "LED TV (55\")", watts: 80, hoursPerDay: 5 },
  { name: "Gaming PC", watts: 500, hoursPerDay: 4 },
  { name: "Laptop", watts: 60, hoursPerDay: 8 },
  { name: "Washing Machine", watts: 500, hoursPerDay: 1 },
  { name: "Dryer", watts: 3000, hoursPerDay: 1 },
  { name: "Dishwasher", watts: 1800, hoursPerDay: 1 },
  { name: "Microwave", watts: 1100, hoursPerDay: 0.5 },
  { name: "Ceiling Fan", watts: 75, hoursPerDay: 12 },
  { name: "LED Light Bulb", watts: 10, hoursPerDay: 8 },
  { name: "Hair Dryer", watts: 1500, hoursPerDay: 0.25 },
  { name: "Electric Oven", watts: 2500, hoursPerDay: 1 },
  { name: "Coffee Maker", watts: 900, hoursPerDay: 0.5 },
  { name: "Wi-Fi Router", watts: 12, hoursPerDay: 24 },
  { name: "Phone Charger", watts: 5, hoursPerDay: 3 },
  { name: "Dehumidifier", watts: 300, hoursPerDay: 12 },
  { name: "Electric Water Heater", watts: 4500, hoursPerDay: 3 },
];

let nextId = 1;
function genId(): string {
  return `app-${nextId++}`;
}

function fmtCost(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function ElectricityCalculatorTool() {
  const [costPerKwh, setCostPerKwh] = useState<string>("0.12");
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: genId(), name: "Custom Appliance", watts: 100, hoursPerDay: 8 },
  ]);

  const addCustom = useCallback(() => {
    setAppliances((prev) => [
      ...prev,
      { id: genId(), name: "Custom Appliance", watts: 100, hoursPerDay: 8 },
    ]);
  }, []);

  const addPreset = useCallback((preset: (typeof PRESETS)[0]) => {
    setAppliances((prev) => [
      ...prev,
      { id: genId(), name: preset.name, watts: preset.watts, hoursPerDay: preset.hoursPerDay },
    ]);
  }, []);

  const removeAppliance = useCallback((id: string) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAppliance = useCallback(
    (id: string, field: keyof Omit<Appliance, "id">, value: string | number) => {
      setAppliances((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
      );
    },
    []
  );

  const rate = parseFloat(costPerKwh) || 0;

  const calculations = useMemo(() => {
    return appliances.map((a) => {
      const kwhPerDay = (a.watts * a.hoursPerDay) / 1000;
      const dailyCost = kwhPerDay * rate;
      const monthlyCost = dailyCost * 30;
      const yearlyCost = dailyCost * 365;
      return { ...a, kwhPerDay, dailyCost, monthlyCost, yearlyCost };
    });
  }, [appliances, rate]);

  const totals = useMemo(() => {
    return calculations.reduce(
      (acc, c) => ({
        daily: acc.daily + c.dailyCost,
        monthly: acc.monthly + c.monthlyCost,
        yearly: acc.yearly + c.yearlyCost,
        kwhPerDay: acc.kwhPerDay + c.kwhPerDay,
      }),
      { daily: 0, monthly: 0, yearly: 0, kwhPerDay: 0 }
    );
  }, [calculations]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Electricity Cost Calculator</h1>
      <p className="text-gray-600 mb-6">
        Calculate how much electricity your appliances use and what they cost to
        run. Add multiple appliances to compare energy costs side by side.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Rate Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Electricity Rate ($/kWh)
        </label>
        <input
          type="number"
          value={costPerKwh}
          onChange={(e) => setCostPerKwh(e.target.value)}
          className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
          min="0"
          step="0.01"
        />
        <span className="text-xs text-gray-400 ml-2">
          US average: ~$0.12/kWh
        </span>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">
          Add Common Appliance
        </h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => addPreset(p)}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition"
            >
              {p.name} ({p.watts}W)
            </button>
          ))}
        </div>
      </div>

      {/* Appliance List */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Appliances</h2>
          <button
            onClick={addCustom}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            + Add Custom
          </button>
        </div>

        {appliances.length === 0 && (
          <p className="text-gray-400 text-sm italic">
            Add an appliance above to get started.
          </p>
        )}

        {appliances.map((a) => (
          <div
            key={a.id}
            className="border border-gray-200 rounded-lg p-4 flex flex-wrap items-end gap-4"
          >
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Name
              </label>
              <input
                type="text"
                value={a.name}
                onChange={(e) =>
                  updateAppliance(a.id, "name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Watts
              </label>
              <input
                type="number"
                value={a.watts}
                onChange={(e) =>
                  updateAppliance(a.id, "watts", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                min="0"
              />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Hours/Day
              </label>
              <input
                type="number"
                value={a.hoursPerDay}
                onChange={(e) =>
                  updateAppliance(
                    a.id,
                    "hoursPerDay",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                min="0"
                max="24"
                step="0.25"
              />
            </div>
            <button
              onClick={() => removeAppliance(a.id)}
              className="px-3 py-2 text-red-500 hover:text-red-700 text-sm font-medium transition"
              title="Remove"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Results Table */}
      {calculations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Cost Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-3 py-2 border border-gray-200">
                    Appliance
                  </th>
                  <th className="text-right px-3 py-2 border border-gray-200">
                    kWh/Day
                  </th>
                  <th className="text-right px-3 py-2 border border-gray-200">
                    Daily
                  </th>
                  <th className="text-right px-3 py-2 border border-gray-200">
                    Monthly
                  </th>
                  <th className="text-right px-3 py-2 border border-gray-200">
                    Yearly
                  </th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-medium">
                      {c.name}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right font-mono">
                      {c.kwhPerDay.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right font-mono">
                      {fmtCost(c.dailyCost)}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right font-mono">
                      {fmtCost(c.monthlyCost)}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-right font-mono">
                      {fmtCost(c.yearlyCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-bold">
                  <td className="px-3 py-2 border border-gray-200">Total</td>
                  <td className="px-3 py-2 border border-gray-200 text-right font-mono">
                    {totals.kwhPerDay.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right font-mono">
                    {fmtCost(totals.daily)}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right font-mono text-green-700">
                    {fmtCost(totals.monthly)}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-right font-mono text-green-700">
                    {fmtCost(totals.yearly)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
