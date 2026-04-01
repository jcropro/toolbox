"use client";

import { useState, useMemo } from "react";

const COMMON_PX = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

export function PxToRemTool() {
  const [pxValue, setPxValue] = useState("16");
  const [remValue, setRemValue] = useState("1");
  const [baseFontSize, setBaseFontSize] = useState("16");
  const [bulkInput, setBulkInput] = useState("");
  const [bulkMode, setBulkMode] = useState<"px-to-rem" | "rem-to-px">("px-to-rem");
  const [copied, setCopied] = useState<string | null>(null);

  const base = parseFloat(baseFontSize) || 16;

  const pxToRem = (px: number) => +(px / base).toFixed(4).replace(/\.?0+$/, "");
  const remToPx = (rem: number) => +(rem * base).toFixed(4).replace(/\.?0+$/, "");

  const handlePxChange = (val: string) => {
    setPxValue(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setRemValue(String(pxToRem(num)));
    }
  };

  const handleRemChange = (val: string) => {
    setRemValue(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPxValue(String(remToPx(num)));
    }
  };

  const handleBaseChange = (val: string) => {
    setBaseFontSize(val);
    const newBase = parseFloat(val) || 16;
    const px = parseFloat(pxValue);
    if (!isNaN(px)) {
      setRemValue(String(+(px / newBase).toFixed(4).replace(/\.?0+$/, "")));
    }
  };

  const bulkResults = useMemo(() => {
    if (!bulkInput.trim()) return [];
    const values = bulkInput.split(/[\s,;]+/).filter((v) => v.trim());
    return values.map((v) => {
      const num = parseFloat(v.replace(/px|rem/gi, ""));
      if (isNaN(num)) return { input: v, output: "Invalid", valid: false };
      if (bulkMode === "px-to-rem") {
        return { input: v, output: `${pxToRem(num)}rem`, valid: true };
      }
      return { input: v, output: `${remToPx(num)}px`, valid: true };
    });
  }, [bulkInput, bulkMode, base]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyBulkResults = () => {
    const text = bulkResults
      .filter((r) => r.valid)
      .map((r) => r.output)
      .join("\n");
    copyToClipboard(text, "bulk");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">PX to REM Converter</h1>
      <p className="text-gray-600 mb-6">
        Convert between pixel and rem CSS units instantly. Adjust the base font size, use the quick
        reference table, or bulk convert multiple values at once.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Base Font Size */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Base Font Size (px)
        </label>
        <input
          type="number"
          value={baseFontSize}
          onChange={(e) => handleBaseChange(e.target.value)}
          className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="1"
          step="1"
        />
      </div>

      {/* Main Converter */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Single Conversion</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pixels (px)</label>
            <div className="relative">
              <input
                type="number"
                value={pxValue}
                onChange={(e) => handlePxChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter px value"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">px</span>
            </div>
          </div>

          <div className="text-2xl text-gray-400 mt-5">&#8596;</div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">REM</label>
            <div className="relative">
              <input
                type="number"
                value={remValue}
                onChange={(e) => handleRemChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter rem value"
                step="0.0625"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">rem</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => copyToClipboard(`${remValue}rem`, "rem")}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            {copied === "rem" ? "Copied!" : "Copy REM"}
          </button>
          <button
            onClick={() => copyToClipboard(`${pxValue}px`, "px")}
            className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
          >
            {copied === "px" ? "Copied!" : "Copy PX"}
          </button>
        </div>
      </div>

      {/* Bulk Converter */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Bulk Converter</h2>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setBulkMode("px-to-rem")}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              bulkMode === "px-to-rem"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            PX &rarr; REM
          </button>
          <button
            onClick={() => setBulkMode("rem-to-px")}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              bulkMode === "rem-to-px"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            REM &rarr; PX
          </button>
        </div>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder={
            bulkMode === "px-to-rem"
              ? "Enter px values separated by spaces, commas, or new lines (e.g. 12 14 16 18 20)"
              : "Enter rem values separated by spaces, commas, or new lines (e.g. 0.75 0.875 1 1.125)"
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm font-mono h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {bulkResults.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Results</span>
              <button
                onClick={copyBulkResults}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
              >
                {copied === "bulk" ? "Copied!" : "Copy All"}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm space-y-1 max-h-48 overflow-y-auto">
              {bulkResults.map((r, i) => (
                <div key={i} className={`flex justify-between ${r.valid ? "" : "text-red-500"}`}>
                  <span>{r.input}</span>
                  <span className="text-gray-400 mx-2">&rarr;</span>
                  <span className="font-semibold">{r.output}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Reference Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Quick Reference Table</h2>
        <p className="text-sm text-gray-500 mb-3">Base font size: {base}px</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Pixels</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-700">REM</th>
                <th className="text-left py-2 font-medium text-gray-700">Preview</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_PX.map((px) => (
                <tr
                  key={px}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    handlePxChange(String(px));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <td className="py-2 pr-4 font-mono">{px}px</td>
                  <td className="py-2 pr-4 font-mono">{pxToRem(px)}rem</td>
                  <td className="py-2">
                    <span style={{ fontSize: `${px}px`, lineHeight: 1.2 }}>Aa</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
