"use client";

import { useState, useCallback } from "react";

const COMMON_ENTITIES: [string, string, string][] = [
  ["&amp;", "&", "Ampersand"],
  ["&lt;", "<", "Less than"],
  ["&gt;", ">", "Greater than"],
  ["&quot;", '"', "Double quote"],
  ["&apos;", "'", "Apostrophe"],
  ["&nbsp;", "\u00A0", "Non-breaking space"],
  ["&copy;", "\u00A9", "Copyright"],
  ["&reg;", "\u00AE", "Registered"],
  ["&trade;", "\u2122", "Trademark"],
  ["&ndash;", "\u2013", "En dash"],
  ["&mdash;", "\u2014", "Em dash"],
  ["&laquo;", "\u00AB", "Left guillemet"],
  ["&raquo;", "\u00BB", "Right guillemet"],
  ["&bull;", "\u2022", "Bullet"],
  ["&hellip;", "\u2026", "Ellipsis"],
  ["&euro;", "\u20AC", "Euro"],
  ["&pound;", "\u00A3", "Pound"],
  ["&yen;", "\u00A5", "Yen"],
  ["&deg;", "\u00B0", "Degree"],
  ["&times;", "\u00D7", "Multiplication"],
  ["&divide;", "\u00F7", "Division"],
];

function encodeHtmlEntities(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHtmlEntities(text: string): string {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div.textContent || "";
}

export function HtmlEntitiesTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEncode = useCallback(() => {
    setOutput(encodeHtmlEntities(input));
  }, [input]);

  const handleDecode = useCallback(() => {
    setOutput(decodeHtmlEntities(input));
  }, [input]);

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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">HTML Entity Encoder / Decoder</h1>
      <p className="text-gray-600 mb-6">
        Encode special characters to HTML entities or decode HTML entities back to characters.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={handleEncode} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">Encode</button>
        <button onClick={handleDecode} className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">Decode</button>
        <button onClick={handleCopy} disabled={!output} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer disabled:opacity-40">{copied ? "Copied!" : "Copy Output"}</button>
        <button onClick={() => { setInput(""); setOutput(""); }} className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer">Clear</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or HTML entities..." className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" spellCheck={false} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
          <textarea value={output} readOnly placeholder="Result will appear here..." className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm bg-gray-50 focus:outline-none" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">Common HTML Entities</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2 border border-gray-200">Entity</th>
              <th className="text-left p-2 border border-gray-200">Character</th>
              <th className="text-left p-2 border border-gray-200">Description</th>
            </tr>
          </thead>
          <tbody>
            {COMMON_ENTITIES.map(([entity, char, desc]) => (
              <tr key={entity} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-200 font-mono">{entity}</td>
                <td className="p-2 border border-gray-200 text-center text-lg">{char}</td>
                <td className="p-2 border border-gray-200 text-gray-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">Ad Space</div>
    </div>
  );
}
