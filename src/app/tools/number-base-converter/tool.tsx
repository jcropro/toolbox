"use client";

import { useState, useCallback, useMemo } from "react";

const COMMON_BASES = [
  { label: "Binary (2)", value: 2 },
  { label: "Octal (8)", value: 8 },
  { label: "Decimal (10)", value: 10 },
  { label: "Hexadecimal (16)", value: 16 },
];

function isValidForBase(input: string, base: number): boolean {
  if (!input.trim()) return true;
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base);
  const regex = new RegExp(`^[${chars}]+$`, "i");
  return regex.test(input.trim());
}

function convertBase(input: string, fromBase: number, toBase: number): string {
  if (!input.trim()) return "";
  try {
    const decimal = parseInt(input.trim(), fromBase);
    if (isNaN(decimal)) return "Invalid input";
    return decimal.toString(toBase).toUpperCase();
  } catch {
    return "Invalid input";
  }
}

export function NumberBaseConverterTool() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [customFrom, setCustomFrom] = useState(false);
  const [customTo, setCustomTo] = useState(false);
  const [copied, setCopied] = useState(false);

  const isValid = useMemo(() => isValidForBase(input, fromBase), [input, fromBase]);

  const result = useMemo(() => {
    if (!isValid || !input.trim()) return "";
    return convertBase(input, fromBase, toBase);
  }, [input, fromBase, toBase, isValid]);

  const allConversions = useMemo(() => {
    if (!isValid || !input.trim()) return [];
    const decimal = parseInt(input.trim(), fromBase);
    if (isNaN(decimal)) return [];
    return [
      { label: "Binary (2)", value: decimal.toString(2) },
      { label: "Octal (8)", value: decimal.toString(8) },
      { label: "Decimal (10)", value: decimal.toString(10) },
      { label: "Hexadecimal (16)", value: decimal.toString(16).toUpperCase() },
    ];
  }, [input, fromBase, isValid]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleSwap = () => {
    if (result && result !== "Invalid input") {
      setInput(result);
    }
    const tempBase = fromBase;
    const tempCustom = customFrom;
    setFromBase(toBase);
    setToBase(tempBase);
    setCustomFrom(customTo);
    setCustomTo(tempCustom);
  };

  const renderBaseSelector = (
    label: string,
    base: number,
    setBase: (b: number) => void,
    isCustom: boolean,
    setIsCustom: (c: boolean) => void
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {COMMON_BASES.map((b) => (
          <button
            key={b.value}
            onClick={() => {
              setBase(b.value);
              setIsCustom(false);
            }}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors cursor-pointer ${
              base === b.value && !isCustom
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            {b.label}
          </button>
        ))}
        <button
          onClick={() => setIsCustom(true)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors cursor-pointer ${
            isCustom
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
          }`}
        >
          Custom
        </button>
      </div>
      {isCustom && (
        <input
          type="number"
          min={2}
          max={36}
          value={base}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 2 && v <= 36) setBase(v);
          }}
          className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="2-36"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Number Base Converter</h1>
      <p className="text-gray-600 mb-6">
        Convert numbers between binary, octal, decimal, hexadecimal, and any custom base from 2 to 36.
        Results update in real time as you type.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {/* From base selector */}
        {renderBaseSelector("From Base", fromBase, setFromBase, customFrom, setCustomFrom)}

        {/* Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Input Number</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isValid && input.trim() ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
            placeholder={`Enter a base-${fromBase} number`}
          />
          {!isValid && input.trim() && (
            <p className="text-red-600 text-sm mt-1">
              Invalid character for base {fromBase}. Valid digits: {
                "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, fromBase)
              }
            </p>
          )}
        </div>

        {/* Swap button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwap}
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
            title="Swap bases"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To base selector */}
        {renderBaseSelector("To Base", toBase, setToBase, customTo, setCustomTo)}

        {/* Result */}
        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Result (Base {toBase})</span>
              <button
                onClick={() => handleCopy(result)}
                className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-md hover:bg-white transition-colors cursor-pointer"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-xl font-bold text-gray-900 break-all">{result}</p>
          </div>
        )}
      </div>

      {/* All conversions at once */}
      {allConversions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Common Bases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allConversions.map((conv) => (
              <div
                key={conv.label}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div>
                  <span className="text-xs text-gray-500 block">{conv.label}</span>
                  <span className="font-mono text-sm text-gray-900 break-all">{conv.value}</span>
                </div>
                <button
                  onClick={() => handleCopy(conv.value)}
                  className="shrink-0 ml-3 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white transition-colors cursor-pointer"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About Number Base Conversion</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Number base conversion lets you translate values between different numeral systems.
          Binary (base 2) is used by computers, octal (base 8) in some Unix file permissions,
          decimal (base 10) is everyday counting, and hexadecimal (base 16) is common in
          programming for colors and memory addresses. This tool supports any base from 2 to 36,
          using digits 0-9 and letters A-Z.
        </p>
      </section>
    </div>
  );
}
