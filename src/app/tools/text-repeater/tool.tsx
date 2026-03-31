"use client";

import { useState, useMemo } from "react";

type SeparatorType = "newline" | "space" | "comma" | "custom";

export function TextRepeaterTool() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(5);
  const [separatorType, setSeparatorType] = useState<SeparatorType>("newline");
  const [customSeparator, setCustomSeparator] = useState(", ");
  const [addLineNumbers, setAddLineNumbers] = useState(false);
  const [copied, setCopied] = useState(false);

  const separator = useMemo(() => {
    switch (separatorType) {
      case "newline": return "\n";
      case "space": return " ";
      case "comma": return ", ";
      case "custom": return customSeparator;
    }
  }, [separatorType, customSeparator]);

  const result = useMemo(() => {
    if (!text || count < 1) return "";
    const clampedCount = Math.min(count, 10000);
    const lines: string[] = [];
    for (let i = 0; i < clampedCount; i++) {
      if (addLineNumbers) {
        lines.push(`${i + 1}. ${text}`);
      } else {
        lines.push(text);
      }
    }
    return lines.join(separator);
  }, [text, count, separator, addLineNumbers]);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCountChange = (value: string) => {
    const num = parseInt(value) || 0;
    setCount(Math.max(0, Math.min(10000, num)));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Text Repeater</h1>
      <p className="text-gray-600 mb-6">
        Repeat any text a specified number of times with your choice of separator. Useful for
        generating test data, filling templates, or creating repeated patterns.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Text to repeat</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Enter the text you want to repeat..."
          />
        </div>

        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repetitions (1-10,000)
            </label>
            <input
              type="number"
              min={1}
              max={10000}
              value={count}
              onChange={(e) => handleCountChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Separator</label>
            <select
              value={separatorType}
              onChange={(e) => setSeparatorType(e.target.value as SeparatorType)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newline">New Line</option>
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {separatorType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom separator
              </label>
              <input
                type="text"
                value={customSeparator}
                onChange={(e) => setCustomSeparator(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. | or ;"
              />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer pb-1">
            <input
              type="checkbox"
              checked={addLineNumbers}
              onChange={(e) => setAddLineNumbers(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Line numbers</span>
          </label>
        </div>

        {result && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {result.length.toLocaleString()} characters
              </span>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto font-mono">
              {result.length > 50000 ? result.slice(0, 50000) + "\n\n... (output truncated for display)" : result}
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
