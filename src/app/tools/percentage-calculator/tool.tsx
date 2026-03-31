"use client";

import { useState } from "react";

type Mode = "percentOf" | "isWhatPercent" | "percentChange" | "plusMinus";

interface CalcResult {
  answer: string;
  explanation: string;
}

function calculate(mode: Mode, a: number, b: number, plusMinusOp: "plus" | "minus"): CalcResult | null {
  if (isNaN(a) || isNaN(b)) return null;

  switch (mode) {
    case "percentOf": {
      const result = (a / 100) * b;
      return {
        answer: formatNum(result),
        explanation: `${a}% of ${b} = (${a} / 100) x ${b} = ${formatNum(result)}`,
      };
    }
    case "isWhatPercent": {
      if (b === 0) return { answer: "Undefined", explanation: "Cannot divide by zero." };
      const result = (a / b) * 100;
      return {
        answer: `${formatNum(result)}%`,
        explanation: `${a} / ${b} x 100 = ${formatNum(result)}%`,
      };
    }
    case "percentChange": {
      if (a === 0) return { answer: "Undefined", explanation: "Cannot calculate percentage change from zero." };
      const change = b - a;
      const result = (change / Math.abs(a)) * 100;
      const direction = result > 0 ? "increase" : result < 0 ? "decrease" : "no change";
      return {
        answer: `${formatNum(result)}%`,
        explanation: `((${b} - ${a}) / |${a}|) x 100 = ${formatNum(result)}% (${direction})`,
      };
    }
    case "plusMinus": {
      const delta = (b / 100) * a;
      const result = plusMinusOp === "plus" ? a + delta : a - delta;
      const op = plusMinusOp === "plus" ? "+" : "-";
      return {
        answer: formatNum(result),
        explanation: `${a} ${op} (${b}% of ${a}) = ${a} ${op} ${formatNum(delta)} = ${formatNum(result)}`,
      };
    }
    default:
      return null;
  }
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString();
  return parseFloat(n.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

const MODES: { value: Mode; label: string }[] = [
  { value: "percentOf", label: "What is X% of Y?" },
  { value: "isWhatPercent", label: "X is what % of Y?" },
  { value: "percentChange", label: "% change from X to Y" },
  { value: "plusMinus", label: "X plus/minus Y%" },
];

export function PercentageCalculatorTool() {
  const [mode, setMode] = useState<Mode>("percentOf");
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [plusMinusOp, setPlusMinusOp] = useState<"plus" | "minus">("plus");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = () => {
    const a = parseFloat(inputA);
    const b = parseFloat(inputB);
    setResult(calculate(mode, a, b, plusMinusOp));
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setInputA("");
    setInputB("");
    setResult(null);
  };

  const getLabelA = (): string => {
    switch (mode) {
      case "percentOf": return "Percentage (X)";
      case "isWhatPercent": return "Value (X)";
      case "percentChange": return "From value (X)";
      case "plusMinus": return "Value (X)";
    }
  };

  const getLabelB = (): string => {
    switch (mode) {
      case "percentOf": return "Number (Y)";
      case "isWhatPercent": return "Total (Y)";
      case "percentChange": return "To value (Y)";
      case "plusMinus": return "Percentage (Y)";
    }
  };

  const getDescription = (): string => {
    switch (mode) {
      case "percentOf": return "Calculate what X% of Y equals.";
      case "isWhatPercent": return "Find what percentage X is of Y.";
      case "percentChange": return "Calculate the percentage change from X to Y.";
      case "plusMinus": return "Add or subtract a percentage from a number.";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Percentage Calculator</h1>
      <p className="text-gray-600 mb-6">
        Calculate percentages with step-by-step explanations. Choose a calculation mode below and
        enter your values.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => handleModeChange(m.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === m.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">{getDescription()}</p>

        <div className="flex flex-wrap gap-4 items-end mb-6">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{getLabelA()}</label>
            <input
              type="number"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a number"
            />
          </div>

          {mode === "plusMinus" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
              <select
                value={plusMinusOp}
                onChange={(e) => setPlusMinusOp(e.target.value as "plus" | "minus")}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="plus">Plus (+)</option>
                <option value="minus">Minus (-)</option>
              </select>
            </div>
          )}

          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{getLabelB()}</label>
            <input
              type="number"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a number"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-5">
            <div className="text-3xl font-bold text-blue-600 mb-2">{result.answer}</div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">How it works: </span>
              {result.explanation}
            </div>
          </div>
        )}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
