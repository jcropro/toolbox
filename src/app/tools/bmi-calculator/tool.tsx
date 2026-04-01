"use client";

import { useState, useCallback } from "react";

type UnitSystem = "imperial" | "metric";

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
}

const categories = [
  { label: "Underweight", min: 0, max: 18.5, color: "text-blue-600", bg: "bg-blue-500" },
  { label: "Normal", min: 18.5, max: 25, color: "text-green-600", bg: "bg-green-500" },
  { label: "Overweight", min: 25, max: 30, color: "text-yellow-600", bg: "bg-yellow-500" },
  { label: "Obese", min: 30, max: 100, color: "text-red-600", bg: "bg-red-500" },
];

export function BmiCalculatorTool() {
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [cm, setCm] = useState("175");
  const [lbs, setLbs] = useState("160");
  const [kg, setKg] = useState("72");
  const [result, setResult] = useState<BmiResult | null>(null);

  const calculate = useCallback(() => {
    let heightM: number;
    let weightKg: number;

    if (unit === "imperial") {
      const totalInches = parseFloat(feet) * 12 + parseFloat(inches);
      heightM = totalInches * 0.0254;
      weightKg = parseFloat(lbs) * 0.453592;
    } else {
      heightM = parseFloat(cm) / 100;
      weightKg = parseFloat(kg);
    }

    if (isNaN(heightM) || isNaN(weightKg) || heightM <= 0 || weightKg <= 0) {
      setResult(null);
      return;
    }

    const bmi = weightKg / (heightM * heightM);
    let category = "Obese";
    let color = "text-red-600";

    for (const cat of categories) {
      if (bmi < cat.max) {
        category = cat.label;
        color = cat.color;
        break;
      }
    }

    setResult({ bmi, category, color });
  }, [unit, feet, inches, cm, lbs, kg]);

  const scalePosition = result
    ? Math.min(100, Math.max(0, ((result.bmi - 10) / 35) * 100))
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        BMI Calculator
      </h1>
      <p className="text-gray-600 mb-6">
        Calculate your Body Mass Index to see if your weight falls within a
        healthy range. All calculations happen in your browser &mdash; your data
        stays private.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Unit toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setUnit("imperial")}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            unit === "imperial"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Imperial (ft/in, lbs)
        </button>
        <button
          onClick={() => setUnit("metric")}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            unit === "metric"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Metric (cm, kg)
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {unit === "imperial" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">ft</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      min="0"
                      max="11"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">in</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={lbs}
                  onChange={(e) => setLbs(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">lbs</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">kg</span>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={calculate}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
      >
        Calculate BMI
      </button>

      {/* Result */}
      {result && (
        <div className="mt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center mb-6">
            <div className="text-sm text-gray-500 mb-1">Your BMI</div>
            <div className={`text-5xl font-bold ${result.color}`}>
              {result.bmi.toFixed(1)}
            </div>
            <div className={`text-lg font-semibold mt-2 ${result.color}`}>
              {result.category}
            </div>
          </div>

          {/* Visual scale */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              BMI Scale
            </h2>
            <div className="relative">
              <div className="w-full h-6 rounded-full overflow-hidden flex">
                <div className="bg-blue-400 h-full" style={{ width: "21.25%" }} />
                <div className="bg-green-400 h-full" style={{ width: "16.25%" }} />
                <div className="bg-yellow-400 h-full" style={{ width: "12.5%" }} />
                <div className="bg-red-400 h-full" style={{ width: "50%" }} />
              </div>
              {/* Marker */}
              <div
                className="absolute top-0 -mt-1 transition-all"
                style={{ left: `${scalePosition}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-800" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>10</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>45</span>
              </div>
              <div className="flex mt-1 text-xs">
                <div className="text-blue-600 font-medium" style={{ width: "21.25%" }}>
                  Underweight
                </div>
                <div className="text-green-600 font-medium" style={{ width: "16.25%" }}>
                  Normal
                </div>
                <div className="text-yellow-600 font-medium" style={{ width: "12.5%" }}>
                  Overweight
                </div>
                <div className="text-red-600 font-medium" style={{ width: "50%" }}>
                  Obese
                </div>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className={`p-3 rounded-lg border text-center text-sm ${
                  result.category === cat.label
                    ? "border-gray-800 bg-gray-50 font-bold"
                    : "border-gray-200"
                }`}
              >
                <div className={cat.color}>{cat.label}</div>
                <div className="text-gray-500 text-xs mt-1">
                  {cat.min === 0 ? "<" : cat.min} &ndash;{" "}
                  {cat.max === 100 ? "40+" : cat.max}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About BMI
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Body Mass Index (BMI) is a screening measure calculated from your
          height and weight. While it does not directly measure body fat, a high
          BMI can indicate elevated risk for conditions like heart disease and
          diabetes. BMI does not account for muscle mass, bone density, or fat
          distribution, so consult a healthcare provider for a complete
          assessment.
        </p>
      </section>
    </div>
  );
}
