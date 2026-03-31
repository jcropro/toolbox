"use client";

import { useState, useMemo } from "react";

export function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

    const sentences =
      trimmed === ""
        ? 0
        : trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    const paragraphs =
      trimmed === ""
        ? 0
        : trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

    // Average reading speed: 238 words per minute
    const readingTimeMinutes = words / 238;
    const readingTimeSeconds = Math.ceil(readingTimeMinutes * 60);
    const readingTimeDisplay =
      readingTimeMinutes < 1
        ? `${readingTimeSeconds} sec`
        : `${Math.ceil(readingTimeMinutes)} min`;

    // Average speaking speed: 150 words per minute
    const speakingTimeMinutes = words / 150;
    const speakingTimeSeconds = Math.ceil(speakingTimeMinutes * 60);
    const speakingTimeDisplay =
      speakingTimeMinutes < 1
        ? `${speakingTimeSeconds} sec`
        : `${Math.ceil(speakingTimeMinutes)} min`;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime: readingTimeDisplay,
      speakingTime: speakingTimeDisplay,
    };
  }, [text]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Word Counter</h1>
      <p className="text-gray-600 mb-6">
        Count words, characters, sentences, and paragraphs in real time.
        Estimates reading and speaking time automatically.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Characters (no spaces)" value={stats.charactersNoSpaces} />
        <StatCard label="Reading Time" value={stats.readingTime} />
        <StatCard label="Speaking Time" value={stats.speakingTime} />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-y text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        autoFocus
      />

      {text.length > 0 && (
        <button
          onClick={() => setText("")}
          className="mt-3 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          Clear Text
        </button>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Use This Word Counter</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Simply type or paste your text into the box above. The word count,
          character count, sentence count, and paragraph count update instantly
          as you type. Reading time is estimated at 238 words per minute, the
          average adult reading speed. Speaking time uses 150 words per minute.
          This tool works entirely in your browser &mdash; your text is never
          sent to any server.
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}
