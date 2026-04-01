"use client";

import { useState, useCallback, useMemo } from "react";

// --- Syllable counting ---
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 2) return word.length === 0 ? 0 : 1;

  // Remove trailing silent e
  word = word.replace(/e$/, "");

  // Count vowel groups
  const matches = word.match(/[aeiouy]+/g);
  let count = matches ? matches.length : 1;

  // Ensure at least 1
  return Math.max(1, count);
}

// --- Text stats ---
function analyze(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  // Sentences: split on . ! ? (handles abbreviations imperfectly but good enough)
  const sentences = trimmed
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentenceCount = Math.max(sentences.length, 1);

  // Words
  const words = trimmed
    .split(/\s+/)
    .filter((w) => w.replace(/[^a-zA-Z0-9]/g, "").length > 0);
  const wordCount = words.length;
  if (wordCount === 0) return null;

  // Syllables
  let totalSyllables = 0;
  let complexWords = 0; // words with 3+ syllables (for some metrics)
  for (const w of words) {
    const s = countSyllables(w);
    totalSyllables += s;
    if (s >= 3) complexWords++;
  }

  // Characters (letters only)
  const letterCount = trimmed.replace(/[^a-zA-Z]/g, "").length;

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / wordCount;
  const avgLettersPerWord = letterCount / wordCount;

  // Flesch Reading Ease
  const fleschEase =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Flesch-Kincaid Grade Level
  const fleschKincaid =
    0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

  // Automated Readability Index (ARI)
  const avgCharsPerWord = letterCount / wordCount;
  const ari =
    4.71 * avgCharsPerWord + 0.5 * avgWordsPerSentence - 21.43;

  // Coleman-Liau Index
  const L = (letterCount / wordCount) * 100; // avg letters per 100 words
  const S = (sentenceCount / wordCount) * 100; // avg sentences per 100 words
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

  return {
    sentenceCount,
    wordCount,
    totalSyllables,
    complexWords,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    fleschEase: Math.round(fleschEase * 10) / 10,
    fleschKincaid: Math.round(fleschKincaid * 10) / 10,
    ari: Math.round(ari * 10) / 10,
    colemanLiau: Math.round(colemanLiau * 10) / 10,
  };
}

function fleschLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Very Easy (5th grade)", color: "text-green-600" };
  if (score >= 80) return { label: "Easy (6th grade)", color: "text-green-600" };
  if (score >= 70) return { label: "Fairly Easy (7th grade)", color: "text-green-500" };
  if (score >= 60) return { label: "Standard (8th-9th grade)", color: "text-yellow-600" };
  if (score >= 50) return { label: "Fairly Difficult (10th-12th grade)", color: "text-orange-500" };
  if (score >= 30) return { label: "Difficult (College level)", color: "text-red-500" };
  return { label: "Very Difficult (Graduate level)", color: "text-red-700" };
}

function gradeLabel(grade: number): string {
  const g = Math.round(grade);
  if (g <= 1) return "Kindergarten - 1st Grade";
  if (g <= 5) return `${g}th Grade (Elementary)`;
  if (g <= 8) return `${g}th Grade (Middle School)`;
  if (g <= 12) return `${g}th Grade (High School)`;
  if (g <= 16) return "College Level";
  return "Graduate Level";
}

function ScoreCard({
  title,
  score,
  description,
}: {
  title: string;
  score: number;
  description: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {title}
      </p>
      <p className="text-3xl font-bold text-gray-900">{score}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

export function ReadabilityTool() {
  const [text, setText] = useState("");

  const results = useMemo(() => analyze(text), [text]);

  const handleClear = useCallback(() => setText(""), []);

  const handleSample = useCallback(() => {
    setText(
      "The quick brown fox jumps over the lazy dog. This is a simple sentence for testing readability scores. Longer sentences with more complex vocabulary will produce different readability metrics. The Flesch Reading Ease score measures how easy a passage is to understand, while the Flesch-Kincaid Grade Level estimates the U.S. school grade needed to comprehend the text."
    );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Readability Score Checker
      </h1>
      <p className="text-gray-600 mb-6">
        Paste your text below to calculate Flesch Reading Ease, Flesch-Kincaid
        Grade Level, Automated Readability Index, and Coleman-Liau Index
        scores. Runs entirely in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="mb-4 flex gap-3">
        <button
          onClick={handleSample}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
        >
          Load Sample Text
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer"
        >
          Clear
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white mb-6"
        spellCheck={false}
      />

      {results ? (
        <>
          {/* Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ScoreCard
              title="Flesch Reading Ease"
              score={results.fleschEase}
              description={fleschLabel(results.fleschEase).label}
            />
            <ScoreCard
              title="Flesch-Kincaid Grade"
              score={results.fleschKincaid}
              description={gradeLabel(results.fleschKincaid)}
            />
            <ScoreCard
              title="ARI"
              score={results.ari}
              description={gradeLabel(results.ari)}
            />
            <ScoreCard
              title="Coleman-Liau"
              score={results.colemanLiau}
              description={gradeLabel(results.colemanLiau)}
            />
          </div>

          {/* Reading ease bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Flesch Reading Ease Scale
            </p>
            <div className="relative h-4 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full overflow-hidden">
              <div
                className="absolute top-0 w-1 h-full bg-gray-900 rounded"
                style={{
                  left: `${Math.max(0, Math.min(100, results.fleschEase))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 (Very Hard)</span>
              <span>50</span>
              <span>100 (Very Easy)</span>
            </div>
            <p
              className={`text-sm font-medium mt-2 ${
                fleschLabel(results.fleschEase).color
              }`}
            >
              {fleschLabel(results.fleschEase).label}
            </p>
          </div>

          {/* Text statistics */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Text Statistics
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              {[
                { label: "Words", value: results.wordCount },
                { label: "Sentences", value: results.sentenceCount },
                { label: "Syllables", value: results.totalSyllables },
                {
                  label: "Avg Words/Sentence",
                  value: results.avgWordsPerSentence,
                },
                {
                  label: "Avg Syllables/Word",
                  value: results.avgSyllablesPerWord,
                },
                { label: "Complex Words", value: results.complexWords },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grade recommendation */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-blue-800 mb-1">
              Grade Level Recommendation
            </p>
            <p className="text-sm text-blue-700">
              Based on the average of all four indices, this text is best suited
              for readers at{" "}
              <span className="font-bold">
                {gradeLabel(
                  (results.fleschKincaid + results.ari + results.colemanLiau) /
                    3
                )}
              </span>
              . For general audiences, aim for a Flesch Reading Ease score above
              60 (roughly 8th grade level).
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400 text-sm">
          Enter some text above to see readability scores.
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About Readability Scores
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Readability formulas estimate how difficult a piece of text is to
          read. The <strong>Flesch Reading Ease</strong> score ranges from 0
          (very hard) to 100 (very easy). <strong>Flesch-Kincaid</strong>,{" "}
          <strong>ARI</strong>, and <strong>Coleman-Liau</strong> estimate the
          U.S. school grade level needed to understand the text. Use these
          scores to ensure your writing matches your intended audience. All
          calculations run in your browser &mdash; your text is never uploaded.
        </p>
      </section>
    </div>
  );
}
