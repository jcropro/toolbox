"use client";

import { useState, useCallback } from "react";

function escapeCSVField(field: string, delimiter: string): string {
  const str = String(field ?? "");
  if (
    str.includes(delimiter) ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, fullKey)
      );
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

export function JsonToCsvTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });

  const convert = useCallback(() => {
    if (!input.trim()) {
      setStatus({
        type: "error",
        message: "Please enter some JSON to convert.",
      });
      setOutput("");
      return;
    }

    try {
      let parsed = JSON.parse(input);

      // If it's an object with a single array value, use that array
      if (!Array.isArray(parsed) && typeof parsed === "object" && parsed !== null) {
        const keys = Object.keys(parsed);
        const arrayKey = keys.find((k) => Array.isArray(parsed[k]));
        if (arrayKey) {
          parsed = parsed[arrayKey];
        } else {
          // Wrap single object in an array
          parsed = [parsed];
        }
      }

      if (!Array.isArray(parsed)) {
        setStatus({
          type: "error",
          message: "JSON must be an array of objects, or an object containing an array.",
        });
        setOutput("");
        return;
      }

      if (parsed.length === 0) {
        setStatus({ type: "error", message: "JSON array is empty." });
        setOutput("");
        return;
      }

      // Flatten nested objects
      const flatData = parsed.map((item: unknown) => {
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          return flattenObject(item as Record<string, unknown>);
        }
        return { value: item };
      });

      // Collect all unique headers
      const headerSet = new Set<string>();
      for (const row of flatData) {
        for (const key of Object.keys(row as Record<string, unknown>)) {
          headerSet.add(key);
        }
      }
      const headers = Array.from(headerSet);

      const delim = delimiter === "\\t" ? "\t" : delimiter;
      const lines: string[] = [];

      if (includeHeaders) {
        lines.push(
          headers.map((h) => escapeCSVField(h, delim)).join(delim)
        );
      }

      for (const row of flatData) {
        const obj = row as Record<string, unknown>;
        const values = headers.map((h) => {
          const val = obj[h];
          if (val === null || val === undefined) return "";
          if (Array.isArray(val)) return escapeCSVField(JSON.stringify(val), delim);
          return escapeCSVField(String(val), delim);
        });
        lines.push(values.join(delim));
      }

      const csv = lines.join("\n");
      setOutput(csv);
      setStatus({
        type: "success",
        message: `Converted ${flatData.length} rows with ${headers.length} columns.`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setStatus({ type: "error", message: msg });
      setOutput("");
    }
  }, [input, delimiter, includeHeaders]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const ext = delimiter === "\\t" || delimiter === "\t" ? "tsv" : "csv";
    const blob = new Blob([output], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output, delimiter]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        JSON to CSV Converter
      </h1>
      <p className="text-gray-600 mb-6">
        Paste a JSON array below to convert it to CSV format. Nested objects are
        automatically flattened. Everything runs in your browser &mdash; no data
        leaves your machine.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="delimiter" className="text-gray-700 font-medium">
            Delimiter:
          </label>
          <select
            id="delimiter"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={includeHeaders}
            onChange={(e) => setIncludeHeaders(e.target.checked)}
            className="rounded border-gray-300"
          />
          Include headers
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={convert}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
        >
          Convert to CSV
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? "Copied!" : "Copy CSV"}
        </button>
        <button
          onClick={handleDownload}
          disabled={!output}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download .csv
        </button>
        <button
          onClick={() => {
            setInput("");
            setOutput("");
            setStatus({ type: "idle", message: "" });
          }}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Status */}
      {status.type !== "idle" && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            status.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Input / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'[\n  {"name": "Alice", "age": 30},\n  {"name": "Bob", "age": 25}\n]'}
            className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CSV Output
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="CSV output will appear here..."
            className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm bg-gray-50 focus:outline-none"
          />
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Tool
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Converts JSON arrays into CSV with proper field escaping, custom
          delimiters, and automatic flattening of nested objects. Supports comma,
          semicolon, tab, and pipe delimiters. Download the result as a .csv file
          or copy it to your clipboard.
        </p>
      </section>
    </div>
  );
}
