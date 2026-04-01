"use client";

import { useState, useCallback } from "react";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function getNgrams(words: string[], n: number): Set<string> {
  const grams = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    grams.add(words.slice(i, i + n).join(" "));
  }
  return grams;
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

interface AnalysisResult {
  similarity: number;
  commonWords: string[];
  uniqueToA: string[];
  uniqueToB: string[];
  matchingPhrases: string[];
  wordCountA: number;
  wordCountB: number;
}

function analyze(textA: string, textB: string): AnalysisResult {
  const wordsA = tokenize(textA);
  const wordsB = tokenize(textB);

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  const similarity = jaccardSimilarity(setA, setB) * 100;

  const commonWords = [...setA].filter((w) => setB.has(w)).sort();
  const uniqueToA = [...setA].filter((w) => !setB.has(w)).sort();
  const uniqueToB = [...setB].filter((w) => !setA.has(w)).sort();

  // Find matching phrases (ngrams of length 3, 4, 5)
  const matchingPhrases: string[] = [];
  for (let n = 5; n >= 3; n--) {
    const gramsA = getNgrams(wordsA, n);
    const gramsB = getNgrams(wordsB, n);
    for (const g of gramsA) {
      if (gramsB.has(g) && !matchingPhrases.some((p) => p.includes(g))) {
        matchingPhrases.push(g);
      }
    }
  }

  return {
    similarity,
    commonWords,
    uniqueToA,
    uniqueToB,
    matchingPhrases,
    wordCountA: wordsA.length,
    wordCountB: wordsB.length,
  };
}

function highlightMatches(
  text: string,
  phrases: string[],
  commonWords: Set<string>
): React.ReactNode[] {
  if (!text) return [];
  const words = text.split(/(\s+)/);
  return words.map((segment, i) => {
    const clean = segment.toLowerCase().replace(/[^\w]/g, "");
    if (!clean) return <span key={i}>{segment}</span>;

    const inPhrase = phrases.some((p) => {
      const lowerText = text.toLowerCase();
      const idx = lowerText.indexOf(p);
      if (idx === -1) return false;
      const segStart = text
        .split(/(\s+)/)
        .slice(0, i)
        .join("").length;
      return segStart >= idx && segStart < idx + p.length + 10;
    });

    if (commonWords.has(clean)) {
      return (
        <span
          key={i}
          className={
            inPhrase
              ? "bg-red-200 text-red-900 font-medium"
              : "bg-yellow-200 text-yellow-900"
          }
        >
          {segment}
        </span>
      );
    }
    return <span key={i}>{segment}</span>;
  });
}

export function TextSimilarityTool() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleCompare = useCallback(() => {
    if (!textA.trim() || !textB.trim()) return;
    setResult(analyze(textA, textB));
  }, [textA, textB]);

  const similarityColor =
    result && result.similarity > 70
      ? "text-red-600"
      : result && result.similarity > 40
        ? "text-yellow-600"
        : "text-green-600";

  const commonWordsSet = new Set(result?.commonWords || []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Text Similarity Checker</h1>
      <p className="text-gray-600 mb-6">
        Compare two texts to find similarity percentage, matching phrases,
        common words, and unique words. Uses Jaccard similarity analysis on word
        sets.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Text Inputs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text A
          </label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Paste or type the first text here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
            rows={10}
          />
          <span className="text-xs text-gray-400">
            {tokenize(textA).length} words
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text B
          </label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Paste or type the second text here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
            rows={10}
          />
          <span className="text-xs text-gray-400">
            {tokenize(textB).length} words
          </span>
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={!textA.trim() || !textB.trim()}
        className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium mb-8"
      >
        Compare Texts
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Similarity Score */}
          <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className={`text-5xl font-bold ${similarityColor}`}>
              {result.similarity.toFixed(1)}%
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Jaccard Similarity (word-level)
            </div>
            <div className="flex justify-center gap-8 mt-4 text-sm text-gray-600">
              <span>Text A: {result.wordCountA} words</span>
              <span>Text B: {result.wordCountB} words</span>
            </div>
          </div>

          <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
            Ad Space
          </div>

          {/* Highlighted Texts */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">
                Text A (highlighted matches)
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm leading-relaxed max-h-60 overflow-y-auto">
                {highlightMatches(textA, result.matchingPhrases, commonWordsSet)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">
                Text B (highlighted matches)
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm leading-relaxed max-h-60 overflow-y-auto">
                {highlightMatches(textB, result.matchingPhrases, commonWordsSet)}
              </div>
            </div>
          </div>

          {/* Matching Phrases */}
          {result.matchingPhrases.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">
                Matching Phrases ({result.matchingPhrases.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchingPhrases.map((p, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono"
                  >
                    &quot;{p}&quot;
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Common Words */}
          <div>
            <h3 className="font-semibold mb-2">
              Common Words ({result.commonWords.length})
            </h3>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {result.commonWords.length > 0 ? (
                result.commonWords.map((w, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs"
                  >
                    {w}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">
                  No common words found
                </span>
              )}
            </div>
          </div>

          {/* Unique Words */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">
                Unique to Text A ({result.uniqueToA.length})
              </h3>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {result.uniqueToA.length > 0 ? (
                  result.uniqueToA.map((w, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    No unique words
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Unique to Text B ({result.uniqueToB.length})
              </h3>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {result.uniqueToB.length > 0 ? (
                  result.uniqueToB.map((w, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs"
                    >
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    No unique words
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
