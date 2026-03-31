"use client";

import { useState, useCallback } from "react";

function textToBinary(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function textToHex(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

function textToOctal(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(8).padStart(3, "0"))
    .join(" ");
}

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/[^01]/g, " ").trim();
  if (!cleaned) return "";
  const bytes = cleaned.split(/\s+/);
  return bytes
    .map((b) => {
      const code = parseInt(b, 2);
      if (isNaN(code) || b.length === 0) return "";
      return String.fromCharCode(code);
    })
    .join("");
}

function hexToText(hex: string): string {
  const cleaned = hex.replace(/[^0-9a-fA-F]/g, " ").trim();
  if (!cleaned) return "";
  const bytes = cleaned.split(/\s+/);
  return bytes
    .map((h) => {
      const code = parseInt(h, 16);
      if (isNaN(code) || h.length === 0) return "";
      return String.fromCharCode(code);
    })
    .join("");
}

function octalToText(octal: string): string {
  const cleaned = octal.replace(/[^0-7]/g, " ").trim();
  if (!cleaned) return "";
  const bytes = cleaned.split(/\s+/);
  return bytes
    .map((o) => {
      const code = parseInt(o, 8);
      if (isNaN(code) || o.length === 0) return "";
      return String.fromCharCode(code);
    })
    .join("");
}

export function TextToBinaryTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [decodeFormat, setDecodeFormat] = useState<"binary" | "hex" | "octal">("binary");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const binaryOutput = mode === "encode" ? textToBinary(input) : "";
  const hexOutput = mode === "encode" ? textToHex(input) : "";
  const octalOutput = mode === "encode" ? textToOctal(input) : "";

  let decodedText = "";
  if (mode === "decode" && input) {
    if (decodeFormat === "binary") decodedText = binaryToText(input);
    else if (decodeFormat === "hex") decodedText = hexToText(input);
    else decodedText = octalToText(input);
  }

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Text to Binary Converter
      </h1>
      <p className="text-gray-600 mb-6">
        Convert text to binary, hexadecimal, and octal representations, or
        decode them back to readable text. Everything runs locally in your
        browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode("encode"); setInput(""); }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
            mode === "encode"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Text to Binary / Hex / Octal
        </button>
        <button
          onClick={() => { setMode("decode"); setInput(""); }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
            mode === "decode"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Binary / Hex / Octal to Text
        </button>
      </div>

      {/* Input */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {mode === "decode" && (
          <div className="flex gap-2 mb-4">
            {(["binary", "hex", "octal"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => { setDecodeFormat(fmt); setInput(""); }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                  decodeFormat === fmt
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
              </button>
            ))}
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === "encode"
            ? "Enter text"
            : `Enter ${decodeFormat} (space-separated)`}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Hello World"
              : decodeFormat === "binary"
              ? "01001000 01100101 01101100 01101100 01101111"
              : decodeFormat === "hex"
              ? "48 65 6c 6c 6f"
              : "110 145 154 154 157"
          }
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
        />
      </div>

      {/* Output */}
      {mode === "encode" && input && (
        <div className="space-y-4 mb-6">
          {[
            { label: "Binary", value: binaryOutput, key: "binary" },
            { label: "Hexadecimal", value: hexOutput, key: "hex" },
            { label: "Octal", value: octalOutput, key: "octal" },
          ].map(({ label, value, key }) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
                <button
                  onClick={() => handleCopy(value, key)}
                  className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {copiedField === key ? "Copied!" : "Copy"}
                </button>
              </div>
              <code className="block font-mono text-sm text-gray-800 break-all whitespace-pre-wrap bg-gray-50 p-3 rounded">
                {value}
              </code>
            </div>
          ))}
        </div>
      )}

      {mode === "decode" && input && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Decoded Text
            </span>
            <button
              onClick={() => handleCopy(decodedText, "decoded")}
              className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {copiedField === "decoded" ? "Copied!" : "Copy"}
            </button>
          </div>
          <code className="block font-mono text-sm text-gray-800 break-all whitespace-pre-wrap bg-gray-50 p-3 rounded">
            {decodedText || "(no valid output)"}
          </code>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Converter
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          This tool converts between plain text and its binary, hexadecimal, and
          octal representations using standard ASCII/Unicode character codes.
          Binary uses base-2 (0s and 1s), hexadecimal uses base-16 (0-9, a-f),
          and octal uses base-8 (0-7). All conversions happen instantly in your
          browser with no data sent to any server.
        </p>
      </section>
    </div>
  );
}
