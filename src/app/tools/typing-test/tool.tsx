"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const PARAGRAPHS: { text: string; difficulty: "easy" | "medium" | "hard" }[] = [
  {
    difficulty: "easy",
    text: "The cat sat on the mat and looked at the bird outside. It was a warm day and the sun was shining bright in the blue sky above the trees.",
  },
  {
    difficulty: "easy",
    text: "I like to read books in the park when the weather is nice. My dog runs around and plays with other dogs while I sit on the bench.",
  },
  {
    difficulty: "easy",
    text: "She went to the store to buy some food for dinner. The list had bread, milk, eggs, and some fresh fruit like apples and bananas.",
  },
  {
    difficulty: "easy",
    text: "The kids played in the yard after school until the sun went down. They ran, jumped, and laughed as they chased each other around the big oak tree.",
  },
  {
    difficulty: "medium",
    text: "Programming requires patience and attention to detail, as even small errors can cause significant problems. Developers spend considerable time debugging their code to ensure everything works correctly.",
  },
  {
    difficulty: "medium",
    text: "The restaurant on Fifth Avenue has become famous for its innovative approach to traditional cuisine. Diners frequently praise the exceptional quality of ingredients and the creative presentation of each dish.",
  },
  {
    difficulty: "medium",
    text: "Climate change affects ecosystems worldwide, altering migration patterns and threatening biodiversity. Scientists continue to study these changes, hoping to develop strategies that will preserve vulnerable species and habitats.",
  },
  {
    difficulty: "medium",
    text: "Modern architecture blends functionality with aesthetic appeal, creating structures that serve practical purposes while inspiring admiration. Sustainable building materials have become increasingly popular among forward-thinking designers.",
  },
  {
    difficulty: "hard",
    text: "Quantum mechanics fundamentally challenges our classical understanding of physics; particles exhibit wave-particle duality, existing in superposition until observed. Schrodinger's thought experiment illustrates this paradox beautifully.",
  },
  {
    difficulty: "hard",
    text: "The juxtaposition of nineteenth-century philosophical frameworks with contemporary neuroscience reveals fascinating parallels: both disciplines grapple with consciousness, free will, and the enigmatic relationship between mind and matter.",
  },
  {
    difficulty: "hard",
    text: "Cryptocurrency's decentralized architecture leverages cryptographic hash functions and peer-to-peer networks to facilitate trustless transactions, fundamentally disrupting traditional financial intermediaries and challenging regulatory frameworks worldwide.",
  },
  {
    difficulty: "hard",
    text: "Electromagnetic radiation encompasses an extraordinarily broad spectrum, from high-frequency gamma rays utilized in medical diagnostics to low-frequency radio waves that facilitate intercontinental telecommunications infrastructure.",
  },
];

type TestState = "idle" | "running" | "finished";

export function TypingTestTool() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [testState, setTestState] = useState<TestState>("idle");
  const [currentParagraph, setCurrentParagraph] = useState("");
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getFilteredParagraphs = useCallback(
    () => PARAGRAPHS.filter((p) => p.difficulty === difficulty),
    [difficulty]
  );

  const startTest = useCallback(() => {
    const filtered = getFilteredParagraphs();
    const chosen = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentParagraph(chosen.text);
    setTyped("");
    setStartTime(null);
    setEndTime(null);
    setElapsedMs(0);
    setTestState("running");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [getFilteredParagraphs]);

  const finishTest = useCallback(
    (finalTyped: string) => {
      const now = Date.now();
      setEndTime(now);
      setTestState("finished");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (startTime) {
        setElapsedMs(now - startTime);
      }
    },
    [startTime]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (testState !== "running") return;
      const value = e.target.value;

      if (!startTime) {
        const now = Date.now();
        setStartTime(now);
        timerRef.current = setInterval(() => {
          setElapsedMs(Date.now() - now);
        }, 100);
      }

      setTyped(value);

      if (value.length >= currentParagraph.length) {
        finishTest(value);
      }
    },
    [testState, startTime, currentParagraph, finishTest]
  );

  const calcWPM = () => {
    const timeSeconds = elapsedMs / 1000;
    if (timeSeconds === 0) return 0;
    const wordCount = typed.trim().split(/\s+/).length;
    return Math.round((wordCount / timeSeconds) * 60);
  };

  const calcAccuracy = () => {
    if (typed.length === 0) return 100;
    let correct = 0;
    const len = Math.min(typed.length, currentParagraph.length);
    for (let i = 0; i < len; i++) {
      if (typed[i] === currentParagraph[i]) correct++;
    }
    return Math.round((correct / len) * 100);
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${mins}:${secs.toString().padStart(2, "0")}.${tenths}`;
  };

  const renderParagraph = () => {
    return currentParagraph.split("").map((char, i) => {
      let className = "text-gray-400";
      if (i < typed.length) {
        className = typed[i] === char ? "text-green-600 bg-green-50" : "text-red-600 bg-red-100";
      } else if (i === typed.length) {
        className = "text-gray-800 border-b-2 border-blue-500";
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Typing Speed Test</h1>
      <p className="text-gray-600 mb-6">
        Test your typing speed and accuracy. Start typing to begin the timer. Your words per minute
        (WPM) and accuracy are tracked in real time.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        {testState === "idle" && (
          <div className="text-center py-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="flex gap-2 justify-center">
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      difficulty === d
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={startTest}
              className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Test
            </button>
          </div>
        )}

        {testState === "running" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-6 text-sm">
                <span className="text-gray-600">
                  Time: <strong>{formatTime(elapsedMs)}</strong>
                </span>
                <span className="text-gray-600">
                  WPM: <strong>{startTime ? calcWPM() : 0}</strong>
                </span>
                <span className="text-gray-600">
                  Accuracy: <strong>{calcAccuracy()}%</strong>
                </span>
              </div>
              <button
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setTestState("idle");
                }}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 text-lg leading-relaxed font-mono select-none">
              {renderParagraph()}
            </div>

            <textarea
              ref={inputRef}
              value={typed}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-md p-4 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              placeholder="Start typing here..."
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        )}

        {testState === "finished" && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-6">Results</h2>
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{calcWPM()}</div>
                <div className="text-sm text-gray-600 mt-1">WPM</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{calcAccuracy()}%</div>
                <div className="text-sm text-gray-600 mt-1">Accuracy</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">{formatTime(elapsedMs)}</div>
                <div className="text-sm text-gray-600 mt-1">Time</div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={startTest}
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setTestState("idle")}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Change Difficulty
              </button>
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
