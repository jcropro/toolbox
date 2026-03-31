"use client";

import { useState, useRef } from "react";

export function CsvToJsonTool() {
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [firstRowHeaders, setFirstRowHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCsv = (csv: string, delim: string): string[][] => {
    const rows: string[][] = [];
    let current = "";
    let inQuotes = false;
    let row: string[] = [];

    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      const next = csv[i + 1];

      if (inQuotes) {
        if (char === '"' && next === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === delim) {
          row.push(current.trim());
          current = "";
        } else if (char === "\n" || (char === "\r" && next === "\n")) {
          row.push(current.trim());
          if (row.some((cell) => cell !== "")) {
            rows.push(row);
          }
          row = [];
          current = "";
          if (char === "\r") i++;
        } else {
          current += char;
        }
      }
    }

    // Handle last row
    row.push(current.trim());
    if (row.some((cell) => cell !== "")) {
      rows.push(row);
    }

    return rows;
  };

  const convert = () => {
    setError(null);
    setCopied(false);

    if (!csvInput.trim()) {
      setError("Please enter some CSV data.");
      setJsonOutput("");
      return;
    }

    try {
      const delimChar =
        delimiter === "\\t" ? "\t" : delimiter;
      const rows = parseCsv(csvInput, delimChar);

      if (rows.length === 0) {
        setError("No data found in CSV input.");
        setJsonOutput("");
        return;
      }

      let result: unknown;

      if (firstRowHeaders && rows.length > 1) {
        const headers = rows[0];
        result = rows.slice(1).map((row) => {
          const obj: Record<string, string> = {};
          headers.forEach((header, i) => {
            obj[header || `column_${i + 1}`] = row[i] ?? "";
          });
          return obj;
        });
      } else {
        result = rows;
      }

      setJsonOutput(JSON.stringify(result, null, 2));
    } catch {
      setError("Failed to parse CSV. Please check the format.");
      setJsonOutput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvInput(text);
    };
    reader.readAsText(file);
  };

  const copyOutput = async () => {
    if (!jsonOutput) return;
    await navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        CSV to JSON Converter
      </h1>
      <p className="text-gray-600 mb-6">
        Convert CSV data to JSON format instantly. Supports custom delimiters,
        file upload, and header detection. Runs entirely in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={firstRowHeaders}
            onChange={(e) => setFirstRowHeaders(e.target.checked)}
            className="rounded border-gray-300"
          />
          First row as headers
        </label>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Delimiter:</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value=",">Comma (,)</option>
            <option value="\\t">Tab</option>
            <option value=";">Semicolon (;)</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Upload CSV File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* CSV Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CSV Input
        </label>
        <textarea
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          placeholder={"name,age,city\nAlice,30,New York\nBob,25,London"}
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>

      <button
        onClick={convert}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Convert to JSON
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* JSON Output */}
      {jsonOutput && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              JSON Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyOutput}
                className="px-3 py-1 text-xs rounded-md transition-colors cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={downloadJson}
                className="px-3 py-1 text-xs rounded-md transition-colors cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Download .json
              </button>
            </div>
          </div>
          <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono overflow-auto max-h-96 whitespace-pre">
            {jsonOutput}
          </pre>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          How to Use This CSV to JSON Converter
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Paste your CSV data or upload a file, choose your delimiter and
          header options, then click convert. The tool properly handles quoted
          fields, escaped quotes, and multi-line values. Enable &ldquo;First
          row as headers&rdquo; to use the first row as JSON property names.
          Download the result as a .json file or copy it directly. All
          processing happens locally in your browser &mdash; no data is
          uploaded.
        </p>
      </section>
    </div>
  );
}
