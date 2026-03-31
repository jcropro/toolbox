"use client";

import { useState, useCallback } from "react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
  "accusamus", "iusto", "odio", "dignissimos", "ducimus", "blanditiis",
  "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos",
  "dolores", "quas", "molestias", "excepturi", "obcaecati", "cupiditate",
  "provident", "similique", "mollitia", "animi", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab",
  "illo", "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae",
  "dicta", "explicabo", "nemo", "ipsam", "voluptas", "aspernatur", "aut",
  "odit", "fugit", "consequuntur", "magni", "ratione", "nesciunt", "neque",
  "porro", "quisquam", "dolorem", "adipisci", "numquam", "tempora",
  "incidunt", "magnam", "aliquam", "quaerat", "minima", "nostrum",
  "exercitationem", "ullam", "corporis", "suscipit", "laboriosam",
];

const FIRST_SENTENCE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
  }
  return words.join(" ");
}

function generateSentence(): string {
  const length = randomInt(6, 18);
  const words = generateWords(length);
  return capitalize(words) + ".";
}

function generateSentences(count: number, isFirst: boolean): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && isFirst) {
      sentences.push(FIRST_SENTENCE);
    } else {
      sentences.push(generateSentence());
    }
  }
  return sentences.join(" ");
}

function generateParagraphs(count: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = randomInt(4, 8);
    paragraphs.push(generateSentences(sentenceCount, i === 0));
  }
  return paragraphs.join("\n\n");
}

export function LoremIpsumTool() {
  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let result = "";
    switch (mode) {
      case "paragraphs":
        result = generateParagraphs(count);
        break;
      case "sentences":
        result = generateSentences(count, true);
        break;
      case "words":
        result = generateWords(count);
        break;
    }
    setOutput(result);
    setCopied(false);
  }, [mode, count]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Lorem Ipsum Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate placeholder text for your designs, mockups, and layouts. Choose between
        paragraphs, sentences, or individual words.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "paragraphs" | "sentences" | "words")}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Count (1-50)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={generate}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Generate
          </button>
        </div>

        {output && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {output.length.toLocaleString()} characters
              </span>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {output}
            </div>
          </div>
        )}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
