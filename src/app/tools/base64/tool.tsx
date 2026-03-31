"use client";

import { useState, useCallback, useRef } from "react";

function isBase64(str: string): boolean {
  if (str.length === 0) return false;
  const trimmed = str.trim();
  // Must be at least 4 chars and match base64 pattern
  if (trimmed.length < 4) return false;
  const base64Regex = /^[A-Za-z0-9+/\n\r]+=*$/;
  if (!base64Regex.test(trimmed.replace(/\s/g, ""))) return false;
  // Try to decode and re-encode to verify
  try {
    const decoded = atob(trimmed.replace(/\s/g, ""));
    const reEncoded = btoa(decoded);
    return reEncoded === trimmed.replace(/\s/g, "");
  } catch {
    return false;
  }
}

function safeEncode(text: string): string {
  // Handle Unicode properly by encoding to UTF-8 first
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function safeDecode(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export function Base64Tool() {
  const [plainText, setPlainText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [error, setError] = useState("");
  const [copiedSide, setCopiedSide] = useState<"plain" | "encoded" | null>(null);
  const [fileName, setFileName] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEncode = useCallback(() => {
    setError("");
    setAutoDetected(false);
    if (!plainText) {
      setError("Enter some text to encode.");
      return;
    }
    try {
      const encoded = safeEncode(plainText);
      setEncodedText(encoded);
    } catch (e) {
      setError(`Encoding failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }, [plainText]);

  const handleDecode = useCallback(() => {
    setError("");
    setAutoDetected(false);
    if (!encodedText) {
      setError("Enter some Base64 to decode.");
      return;
    }
    try {
      const decoded = safeDecode(encodedText);
      setPlainText(decoded);
    } catch (e) {
      setError(`Decoding failed: ${e instanceof Error ? e.message : "Invalid Base64 string"}`);
    }
  }, [encodedText]);

  const handlePlainTextChange = useCallback((value: string) => {
    setPlainText(value);
    setError("");
    // Auto-detect base64
    if (isBase64(value)) {
      setAutoDetected(true);
    } else {
      setAutoDetected(false);
    }
  }, []);

  const handleEncodedTextChange = useCallback((value: string) => {
    setEncodedText(value);
    setError("");
  }, []);

  const handleCopy = useCallback(async (text: string, side: "plain" | "encoded") => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSide(side);
      setTimeout(() => setCopiedSide(null), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedSide(side);
      setTimeout(() => setCopiedSide(null), 2000);
    }
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is a data URL like "data:...;base64,XXXXX"
      // We want just the base64 part
      const base64 = result.split(",")[1] || "";
      setEncodedText(base64);
      setPlainText(`[File: ${file.name}, ${(file.size / 1024).toFixed(1)} KB]`);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    setPlainText("");
    setEncodedText("");
    setError("");
    setFileName("");
    setAutoDetected(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Base64 Encoder / Decoder
      </h1>
      <p className="text-gray-600 mb-6">
        Encode text or files to Base64, or decode Base64 strings back to plain
        text. Supports Unicode and file uploads. Everything stays in your
        browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-800 border border-red-200">
          {error}
        </div>
      )}

      {/* Auto-detect notice */}
      {autoDetected && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200">
          This looks like Base64 &mdash; try the Decode button to convert it back
          to text.
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <button
          onClick={handleEncode}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
        >
          Encode &rarr;
        </button>
        <button
          onClick={handleDecode}
          className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer"
        >
          &larr; Decode
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
        >
          Clear
        </button>

        <div className="ml-auto">
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {fileName || "Upload File"}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Plain text side */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              Plain Text
            </label>
            <button
              onClick={() => handleCopy(plainText, "plain")}
              disabled={!plainText}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
            >
              {copiedSide === "plain" ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={plainText}
            onChange={(e) => handlePlainTextChange(e.target.value)}
            placeholder="Enter text to encode..."
            className="w-full h-72 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>

        {/* Encoded side */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              Base64 Encoded
            </label>
            <button
              onClick={() => handleCopy(encodedText, "encoded")}
              disabled={!encodedText}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
            >
              {copiedSide === "encoded" ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={encodedText}
            onChange={(e) => handleEncodedTextChange(e.target.value)}
            placeholder="Base64 encoded output will appear here..."
            className="w-full h-72 p-4 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About Base64 Encoding
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Base64 is a binary-to-text encoding scheme that represents binary data
          as ASCII characters. It is commonly used in email attachments, data
          URIs, and embedding binary data in JSON or XML. This tool supports
          full Unicode text encoding and file-to-Base64 conversion. Everything
          processes locally in your browser &mdash; your data is never uploaded.
        </p>
      </section>
    </div>
  );
}
