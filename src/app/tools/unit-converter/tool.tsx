"use client";

import { useState, useMemo } from "react";

type UnitCategory = keyof typeof unitData;

const unitData = {
  Length: {
    units: ["Meter", "Kilometer", "Centimeter", "Millimeter", "Mile", "Yard", "Foot", "Inch", "Nautical Mile"],
    toBase: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Mile: 1609.344,
      Yard: 0.9144,
      Foot: 0.3048,
      Inch: 0.0254,
      "Nautical Mile": 1852,
    } as Record<string, number>,
  },
  Weight: {
    units: ["Kilogram", "Gram", "Milligram", "Pound", "Ounce", "Ton (metric)", "Ton (US)", "Stone"],
    toBase: {
      Kilogram: 1,
      Gram: 0.001,
      Milligram: 0.000001,
      Pound: 0.453592,
      Ounce: 0.0283495,
      "Ton (metric)": 1000,
      "Ton (US)": 907.185,
      Stone: 6.35029,
    } as Record<string, number>,
  },
  Temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    toBase: {} as Record<string, number>,
  },
  Volume: {
    units: ["Liter", "Milliliter", "Gallon (US)", "Quart (US)", "Pint (US)", "Cup (US)", "Fluid Ounce (US)", "Tablespoon", "Teaspoon", "Cubic Meter", "Cubic Foot"],
    toBase: {
      Liter: 1,
      Milliliter: 0.001,
      "Gallon (US)": 3.78541,
      "Quart (US)": 0.946353,
      "Pint (US)": 0.473176,
      "Cup (US)": 0.24,
      "Fluid Ounce (US)": 0.0295735,
      Tablespoon: 0.0147868,
      Teaspoon: 0.00492892,
      "Cubic Meter": 1000,
      "Cubic Foot": 28.3168,
    } as Record<string, number>,
  },
  Area: {
    units: ["Square Meter", "Square Kilometer", "Square Mile", "Square Yard", "Square Foot", "Square Inch", "Hectare", "Acre"],
    toBase: {
      "Square Meter": 1,
      "Square Kilometer": 1e6,
      "Square Mile": 2.59e6,
      "Square Yard": 0.836127,
      "Square Foot": 0.092903,
      "Square Inch": 0.00064516,
      Hectare: 10000,
      Acre: 4046.86,
    } as Record<string, number>,
  },
  Speed: {
    units: ["Meters/second", "Kilometers/hour", "Miles/hour", "Knot", "Feet/second"],
    toBase: {
      "Meters/second": 1,
      "Kilometers/hour": 0.277778,
      "Miles/hour": 0.44704,
      Knot: 0.514444,
      "Feet/second": 0.3048,
    } as Record<string, number>,
  },
  Data: {
    units: ["Byte", "Kilobyte", "Megabyte", "Gigabyte", "Terabyte", "Petabyte", "Bit", "Kibibyte", "Mebibyte", "Gibibyte", "Tebibyte"],
    toBase: {
      Byte: 1,
      Kilobyte: 1000,
      Megabyte: 1e6,
      Gigabyte: 1e9,
      Terabyte: 1e12,
      Petabyte: 1e15,
      Bit: 0.125,
      Kibibyte: 1024,
      Mebibyte: 1048576,
      Gibibyte: 1073741824,
      Tebibyte: 1099511627776,
    } as Record<string, number>,
  },
} as const;

function convertTemperature(value: number, from: string, to: string): number {
  // Convert to Celsius first
  let celsius: number;
  if (from === "Celsius") celsius = value;
  else if (from === "Fahrenheit") celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15; // Kelvin

  // Convert from Celsius to target
  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return celsius * (9 / 5) + 32;
  return celsius + 273.15; // Kelvin
}

function formatResult(num: number): string {
  if (num === 0) return "0";
  if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(6);
  }
  // Avoid floating point weirdness
  const str = num.toPrecision(12);
  return parseFloat(str).toString();
}

export function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>("Length");
  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");
  const [inputValue, setInputValue] = useState("1");

  const categories = Object.keys(unitData) as UnitCategory[];
  const currentUnits = unitData[category].units;

  const result = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return "";

    if (category === "Temperature") {
      return formatResult(convertTemperature(num, fromUnit, toUnit));
    }

    const toBase = (unitData[category] as { units: readonly string[]; toBase: Record<string, number> }).toBase;
    const fromFactor = toBase[fromUnit];
    const toFactor = toBase[toUnit];
    if (fromFactor === undefined || toFactor === undefined) return "";

    return formatResult((num * fromFactor) / toFactor);
  }, [inputValue, fromUnit, toUnit, category]);

  function handleCategoryChange(newCategory: UnitCategory) {
    setCategory(newCategory);
    const units = unitData[newCategory].units;
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue("1");
  }

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit Converter</h1>
      <p className="text-gray-600 mb-6">
        Convert between units of length, weight, temperature, volume, area, speed,
        and data storage. Results update in real time as you type.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              category === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            >
              {currentUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Swap units"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            >
              {currentUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg bg-gray-50 text-gray-800 min-h-[44px]">
              {result || <span className="text-gray-400">--</span>}
            </div>
          </div>
        </div>

        {/* Conversion summary */}
        {result && inputValue && (
          <p className="mt-4 text-center text-sm text-gray-500">
            {inputValue} {fromUnit} = {result} {toUnit}
          </p>
        )}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Use This Unit Converter</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Select a category (Length, Weight, Temperature, etc.), choose the units
          you want to convert between, and enter a value. The result updates
          instantly. Use the swap button to quickly reverse the conversion
          direction. All calculations run in your browser &mdash; nothing is sent
          to a server.
        </p>
      </section>
    </div>
  );
}
