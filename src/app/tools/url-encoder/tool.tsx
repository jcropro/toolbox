"use client";

import { useState, useCallback } from "react";

export function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"component" | "full">("component");
  const [copied, setCopied] = useState(false);

  const handleEncode = useCallback(() => {
    if (!input) return;
    setOutput(mode === "component" ? encodeURIComponent(input) : encodeURI(input));
  }, [input, mode]);

  const handleDecode = useCallback(() => {
    if (!input) return;
    try {
      setOutput(mode === "component" ? decodeURIComponent(input) : decodeURI(input));
    } catch {
      setOutput("Error: Invalid encoded string");
    }
  }, [input, mode]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Encoder / Decoder</h1>
      <p className="text-gray-600 mb-6">Encode and decode URLs and URI components. Handles special characters, query strings, and full URLs.</p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <button onClick={handleEncode} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">Encode</button>
        <button onClick={handleDecode} className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">Decode</button>
        <button onClick={handleCopy} disabled={!output} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer disabled:opacity-40">{copied ? "Copied!" : "Copy Output"}</button>
        <button onClick={() => { setInput(""); setOutput(""); }} className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer">Clear</button>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
          <label>Mode:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as "component" | "full")} className="border border-gray-300 rounded px-2 py-1 text-sm bg-white">
            <option value="component">URI Component</option>
            <option value="full">Full URI</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or URL to encode/decode..." className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" spellCheck={false} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
          <textarea value={output} readOnly placeholder="Result will appear here..." className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm bg-gray-50 focus:outline-none" />
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>
    </div>
  );
}
