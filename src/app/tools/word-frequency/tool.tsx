"use client";

import { useState, useCallback, useMemo } from "react";

const COMMON_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "it", "as", "be", "was", "are",
  "were", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "could", "should", "may", "might", "shall", "can",
  "this", "that", "these", "those", "i", "you", "he", "she", "we",
  "they", "me", "him", "her", "us", "them", "my", "your", "his",
  "its", "our", "their", "not", "no", "so", "if", "then", "than",
  "too", "very", "just", "about", "up", "out", "into", "over",
  "after", "before", "between", "under", "again", "there", "here",
  "when", "where", "how", "all", "each", "every", "both", "few",
  "more", "most", "other", "some", "such", "only", "own", "same",
  "also", "what", "which", "who", "whom", "why",
]);

interface WordEntry {
  word: string;
  count: number;
}

export function WordFrequencyTool() {
  const [input, setInput] = useState("");
  const [excludeCommon, setExcludeCommon] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showChart, setShowChart] = useState(true);

  const results = useMemo((): WordEntry[] => {
    if (!input.trim()) return [];

    const words = input.match(/[a-zA-Z\u00C0-\u024F']+/g);
    if (!words) return [];

    const freq = new Map<string, number>();
    for (const raw of words) {
      const word = caseSensitive ? raw : raw.toLowerCase();
      if (excludeCommon && COMMON_WORDS.has(word.toLowerCase())) continue;
      freq.set(word, (freq.get(word) || 0) + 1);
    }

    return Array.from(freq.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  }, [input, excludeCommon, caseSensitive]);

  const totalWords = useMemo(() => {
    if (!input.trim()) return 0;
    const words = input.match(/[a-zA-Z\u00C0-\u024F']+/g);
    return words ? words.length : 0;
  }, [input]);

  const uniqueWords = results.length;
  const maxCount = results.length > 0 ? results[0].count : 1;
  const topN = 25;

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (results.length === 0) return;
    const text = results.map((r) => `${r.word}\t${r.count}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [results]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Word Frequency Counter
      </h1>
      <p className="text-gray-600 mb-6">
        Paste any text below to see how often each word appears. Filter out
        common stop words, toggle case sensitivity, and visualize the top words
        with a bar chart. Everything runs locally in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Input */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Text Input
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        spellCheck={false}
      />

      {/* Options */}
      <div className="flex flex-wrap gap-4 mt-4 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeCommon}
            onChange={(e) => setExcludeCommon(e.target.checked)}
            className="rounded border-gray-300"
          />
          Exclude common words
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-gray-300"
          />
          Case sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={showChart}
            onChange={(e) => setShowChart(e.target.checked)}
            className="rounded border-gray-300"
          />
          Show chart
        </label>
        <button
          onClick={handleCopy}
          disabled={results.length === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? "Copied!" : "Copy Results"}
        </button>
        <button
          onClick={() => setInput("")}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Stats bar */}
      {input.trim() && (
        <div className="flex gap-6 mb-6 text-sm">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <span className="text-blue-600 font-semibold">{totalWords}</span>{" "}
            <span className="text-blue-800">total words</span>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
            <span className="text-purple-600 font-semibold">{uniqueWords}</span>{" "}
            <span className="text-purple-800">unique words</span>
          </div>
        </div>
      )}

      {/* Bar chart */}
      {showChart && results.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Top {Math.min(topN, results.length)} Words
          </h2>
          <div className="space-y-1.5">
            {results.slice(0, topN).map((entry) => (
              <div key={entry.word} className="flex items-center gap-2 text-sm">
                <span className="w-28 text-right text-gray-700 font-mono truncate">
                  {entry.word}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max((entry.count / maxCount) * 100, 2)}%`,
                    }}
                  />
                </div>
                <span className="w-10 text-gray-600 text-xs font-mono">
                  {entry.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full table */}
      {results.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">
                    #
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">
                    Word
                  </th>
                  <th className="text-right px-4 py-2 font-medium text-gray-700">
                    Count
                  </th>
                  <th className="text-right px-4 py-2 font-medium text-gray-700">
                    Frequency
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((entry, i) => (
                  <tr
                    key={entry.word}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-1.5 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-1.5 font-mono text-gray-900">
                      {entry.word}
                    </td>
                    <td className="px-4 py-1.5 text-right text-gray-700">
                      {entry.count}
                    </td>
                    <td className="px-4 py-1.5 text-right text-gray-500">
                      {totalWords > 0
                        ? ((entry.count / totalWords) * 100).toFixed(1)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Tool
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Analyzes your text to count how many times each word appears. Exclude
          over 100 common English stop words (the, a, is, etc.) to focus on
          meaningful content. Toggle case sensitivity to treat &ldquo;The&rdquo;
          and &ldquo;the&rdquo; as the same or different words. The bar chart
          shows the top 25 words by frequency.
        </p>
      </section>
    </div>
  );
}
