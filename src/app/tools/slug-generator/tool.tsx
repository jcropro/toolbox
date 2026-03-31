"use client";

import { useState, useMemo, useCallback } from "react";

const accentMap: Record<string, string> = {
  "\u00e0": "a", "\u00e1": "a", "\u00e2": "a", "\u00e3": "a", "\u00e4": "a", "\u00e5": "a",
  "\u00e6": "ae",
  "\u00e7": "c",
  "\u00e8": "e", "\u00e9": "e", "\u00ea": "e", "\u00eb": "e",
  "\u00ec": "i", "\u00ed": "i", "\u00ee": "i", "\u00ef": "i",
  "\u00f0": "d",
  "\u00f1": "n",
  "\u00f2": "o", "\u00f3": "o", "\u00f4": "o", "\u00f5": "o", "\u00f6": "o", "\u00f8": "o",
  "\u00f9": "u", "\u00fa": "u", "\u00fb": "u", "\u00fc": "u",
  "\u00fd": "y",
  "\u00fe": "th",
  "\u00ff": "y",
  "\u0100": "a", "\u0101": "a", "\u0102": "a", "\u0103": "a", "\u0104": "a", "\u0105": "a",
  "\u0106": "c", "\u0107": "c", "\u0108": "c", "\u0109": "c", "\u010a": "c", "\u010b": "c", "\u010c": "c", "\u010d": "c",
  "\u010e": "d", "\u010f": "d", "\u0110": "d", "\u0111": "d",
  "\u0112": "e", "\u0113": "e", "\u0114": "e", "\u0115": "e", "\u0116": "e", "\u0117": "e", "\u0118": "e", "\u0119": "e", "\u011a": "e", "\u011b": "e",
  "\u011c": "g", "\u011d": "g", "\u011e": "g", "\u011f": "g", "\u0120": "g", "\u0121": "g", "\u0122": "g", "\u0123": "g",
  "\u0124": "h", "\u0125": "h", "\u0126": "h", "\u0127": "h",
  "\u0128": "i", "\u0129": "i", "\u012a": "i", "\u012b": "i", "\u012c": "i", "\u012d": "i", "\u012e": "i", "\u012f": "i", "\u0130": "i", "\u0131": "i",
  "\u0134": "j", "\u0135": "j",
  "\u0136": "k", "\u0137": "k",
  "\u0139": "l", "\u013a": "l", "\u013b": "l", "\u013c": "l", "\u013d": "l", "\u013e": "l", "\u0141": "l", "\u0142": "l",
  "\u0143": "n", "\u0144": "n", "\u0145": "n", "\u0146": "n", "\u0147": "n", "\u0148": "n",
  "\u014c": "o", "\u014d": "o", "\u014e": "o", "\u014f": "o", "\u0150": "o", "\u0151": "o", "\u0152": "oe", "\u0153": "oe",
  "\u0154": "r", "\u0155": "r", "\u0156": "r", "\u0157": "r", "\u0158": "r", "\u0159": "r",
  "\u015a": "s", "\u015b": "s", "\u015c": "s", "\u015d": "s", "\u015e": "s", "\u015f": "s", "\u0160": "s", "\u0161": "s",
  "\u0162": "t", "\u0163": "t", "\u0164": "t", "\u0165": "t",
  "\u0168": "u", "\u0169": "u", "\u016a": "u", "\u016b": "u", "\u016c": "u", "\u016d": "u", "\u016e": "u", "\u016f": "u", "\u0170": "u", "\u0171": "u", "\u0172": "u", "\u0173": "u",
  "\u0174": "w", "\u0175": "w",
  "\u0176": "y", "\u0177": "y", "\u0178": "y",
  "\u0179": "z", "\u017a": "z", "\u017b": "z", "\u017c": "z", "\u017d": "z", "\u017e": "z",
  "\u00df": "ss",
};

function removeAccents(str: string): string {
  return str
    .split("")
    .map((char) => accentMap[char] || char)
    .join("");
}

function generateSlug(
  input: string,
  separator: string,
  lowercase: boolean,
  maxLength: number
): string {
  let slug = removeAccents(input);

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Replace non-alphanumeric characters with separator
  slug = slug.replace(/[^a-zA-Z0-9]+/g, separator);

  // Remove leading/trailing separators
  slug = slug.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), "");

  // Collapse multiple separators
  slug = slug.replace(new RegExp(`\\${separator}{2,}`, "g"), separator);

  // Enforce max length (cut at separator boundary if possible)
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    const lastSep = slug.lastIndexOf(separator);
    if (lastSep > maxLength * 0.5) {
      slug = slug.substring(0, lastSep);
    }
  }

  return slug;
}

export function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(0); // 0 = no limit
  const [copied, setCopied] = useState(false);

  const slug = useMemo(
    () => generateSlug(input, separator, lowercase, maxLength),
    [input, separator, lowercase, maxLength]
  );

  const handleCopy = useCallback(async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [slug]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Slug Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate clean, URL-friendly slugs from any text. Handles accented
        characters, unicode, and special characters automatically.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to a slug..."
          className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-y text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          autoFocus
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-6 mb-6 items-center">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
            Separator
          </label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="lowercase"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="lowercase" className="text-sm text-gray-700">
            Lowercase
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
            Max Length
          </label>
          <input
            type="number"
            value={maxLength || ""}
            onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
            placeholder="No limit"
            min={0}
            className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Output */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Generated Slug</label>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-base font-mono text-gray-800 min-h-[48px] break-all">
            {slug || <span className="text-gray-400">your-slug-here</span>}
          </div>
          <button
            onClick={handleCopy}
            disabled={!slug}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        {slug && (
          <p className="mt-1 text-xs text-gray-400">{slug.length} characters</p>
        )}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Use This Slug Generator</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Type or paste any text into the input field. The slug updates in real
          time. Choose between hyphens or underscores as separators, toggle
          lowercase, and set a maximum length. Accented characters like
          &eacute;, &uuml;, and &ntilde; are transliterated to their ASCII
          equivalents. All processing runs in your browser &mdash; nothing is
          sent to any server.
        </p>
      </section>
    </div>
  );
}
