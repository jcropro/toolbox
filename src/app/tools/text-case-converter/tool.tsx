"use client";

import { useState, useCallback } from "react";

function toWords(text: string): string[] {
  // Split on spaces, underscores, hyphens, and camelCase boundaries
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function toUpperCase(text: string): string {
  return text.toUpperCase();
}

function toLowerCase(text: string): string {
  return text.toLowerCase();
}

function toTitleCase(text: string): string {
  return text.replace(
    /\b\w+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
}

function toCamelCase(text: string): string {
  const words = toWords(text);
  if (words.length === 0) return "";
  return words
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
}

function toPascalCase(text: string): string {
  const words = toWords(text);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

function toSnakeCase(text: string): string {
  return toWords(text)
    .map((w) => w.toLowerCase())
    .join("_");
}

function toKebabCase(text: string): string {
  return toWords(text)
    .map((w) => w.toLowerCase())
    .join("-");
}

const CONVERSIONS = [
  { label: "UPPERCASE", fn: toUpperCase },
  { label: "lowercase", fn: toLowerCase },
  { label: "Title Case", fn: toTitleCase },
  { label: "Sentence case", fn: toSentenceCase },
  { label: "camelCase", fn: toCamelCase },
  { label: "PascalCase", fn: toPascalCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
] as const;

export function TextCaseConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeCase, setActiveCase] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(
    (label: string, fn: (text: string) => string) => {
      setOutput(fn(input));
      setActiveCase(label);
    },
    [input]
  );

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Text Case Converter
      </h1>
      <p className="text-gray-600 mb-6">
        Convert text between different cases instantly. Supports uppercase,
        lowercase, Title Case, camelCase, snake_case, kebab-case, and more.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-y text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          autoFocus
        />
      </div>

      {/* Conversion buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CONVERSIONS.map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => handleConvert(label, fn)}
            disabled={!input.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              activeCase === label
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Output */}
      {output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Result{activeCase ? ` (${activeCase})` : ""}
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-y text-base bg-gray-50 focus:outline-none"
          />
        </div>
      )}

      {input.length > 0 && (
        <button
          onClick={() => {
            setInput("");
            setOutput("");
            setActiveCase("");
          }}
          className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Case Converter
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Convert text to any common case format with one click. Useful for
          programming (camelCase, PascalCase, snake_case, kebab-case), writing
          (Title Case, Sentence case), or formatting (UPPERCASE, lowercase).
          Works entirely in your browser with no data sent anywhere.
        </p>
      </section>
    </div>
  );
}
