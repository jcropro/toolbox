"use client";

import { useState, useCallback } from "react";

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setStatus({ type: "error", message: "Please enter some JSON to format." });
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setStatus({ type: "success", message: "JSON formatted successfully." });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setOutput("");
      setStatus({ type: "error", message: errorMessage });
    }
  }, [input, indentSize]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setStatus({ type: "error", message: "Please enter some JSON to minify." });
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStatus({ type: "success", message: `Minified. Saved ${input.length - minified.length} characters.` });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setOutput("");
      setStatus({ type: "error", message: errorMessage });
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setStatus({ type: "error", message: "Please enter some JSON to validate." });
      return;
    }
    try {
      JSON.parse(input);
      setStatus({ type: "success", message: "Valid JSON." });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      // Try to extract position info
      const posMatch = errorMessage.match(/position\s+(\d+)/i);
      if (posMatch) {
        const position = parseInt(posMatch[1], 10);
        const before = input.substring(0, position);
        const line = before.split("\n").length;
        const col = position - before.lastIndexOf("\n");
        setStatus({
          type: "error",
          message: `Invalid JSON at line ${line}, column ${col}: ${errorMessage}`,
        });
      } else {
        setStatus({ type: "error", message: `Invalid JSON: ${errorMessage}` });
      }
    }
  }, [input]);

  const handleCopy = useCallback(async () => {
    const textToCopy = output || input;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output, input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setStatus({ type: "idle", message: "" });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON Formatter & Validator</h1>
      <p className="text-gray-600 mb-6">
        Paste your JSON below to format, minify, or validate it. Everything runs
        in your browser &mdash; your data never leaves your machine.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer"
        >
          Minify
        </button>
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer"
        >
          Validate
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
        >
          {copied ? "Copied!" : "Copy Output"}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
        >
          Clear
        </button>

        <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
          <label htmlFor="indent-size">Indent:</label>
          <select
            id="indent-size"
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
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

      {/* Text areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here, e.g. {"name": "value"}'
            className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Output
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted or minified JSON will appear here..."
            className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm bg-gray-50 focus:outline-none"
          />
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About This JSON Tool</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Use this tool to pretty-print messy JSON with proper indentation, minify
          JSON to save space, or validate JSON syntax and pinpoint errors by line
          number. Runs entirely in your browser &mdash; nothing is uploaded. Supports
          2-space and 4-space indentation.
        </p>
      </section>
    </div>
  );
}
