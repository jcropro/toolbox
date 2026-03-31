"use client";

import { useState, useCallback } from "react";

function generateUuidV4(): string {
  // crypto.getRandomValues for proper randomness
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Set version (4) and variant (10xx) bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [bulkCount, setBulkCount] = useState(10);
  const [showHyphens, setShowHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const format = useCallback(
    (uuid: string) => {
      let result = showHyphens ? uuid : uuid.replace(/-/g, "");
      return uppercase ? result.toUpperCase() : result;
    },
    [showHyphens, uppercase]
  );

  const generateOne = () => {
    setUuids([generateUuidV4()]);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const generateBulk = () => {
    const count = Math.max(1, Math.min(100, bulkCount));
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generateUuidV4());
    }
    setUuids(results);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const copyOne = async (index: number) => {
    await navigator.clipboard.writeText(format(uuids[index]));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = async () => {
    const text = uuids.map(format).join("\n");
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">UUID Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate random UUID v4 identifiers for databases, APIs, and unique IDs. Generate
        one at a time or bulk generate up to 100 UUIDs instantly.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-end mb-6">
          <button
            onClick={generateOne}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Generate UUID
          </button>

          <div className="flex items-end gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Count (1-100)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={bulkCount}
                onChange={(e) =>
                  setBulkCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={generateBulk}
              className="bg-gray-800 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Generate Bulk
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showHyphens}
              onChange={(e) => setShowHyphens(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Show hyphens
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Uppercase
          </label>
        </div>

        {/* Output */}
        {uuids.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {uuids.length} UUID{uuids.length !== 1 ? "s" : ""} generated
              </span>
              <button
                onClick={copyAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {copiedAll ? "Copied All!" : "Copy All"}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
              {uuids.map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 group"
                >
                  <code className="text-sm font-mono text-gray-800 select-all">
                    {format(uuid)}
                  </code>
                  <button
                    onClick={() => copyOne(i)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === i ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
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
