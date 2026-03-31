"use client";

import { useState, useCallback } from "react";

function getSecureRandom(min: number, max: number): number {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

function generateNumbers(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean,
  sort: boolean
): number[] {
  if (min > max) [min, max] = [max, min];
  const range = max - min + 1;

  let results: number[] = [];

  if (!allowDuplicates && count > range) {
    count = range;
  }

  if (!allowDuplicates) {
    const pool = new Set<number>();
    while (pool.size < count) {
      pool.add(getSecureRandom(min, max));
    }
    results = Array.from(pool);
  } else {
    for (let i = 0; i < count; i++) {
      results.push(getSecureRandom(min, max));
    }
  }

  if (sort) results.sort((a, b) => a - b);
  return results;
}

function rollDice(numDice: number, sides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < numDice; i++) {
    results.push(getSecureRandom(1, sides));
  }
  return results;
}

const DICE_SIDES = [4, 6, 8, 10, 12, 20];

export function RandomNumberTool() {
  // Number generator state
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sortResults, setSortResults] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);

  // Dice state
  const [numDice, setNumDice] = useState(1);
  const [diceSides, setDiceSides] = useState(6);
  const [diceResults, setDiceResults] = useState<number[]>([]);

  // Coin state
  const [coinResult, setCoinResult] = useState<"heads" | "tails" | null>(null);
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [flipHistory, setFlipHistory] = useState<("heads" | "tails")[]>([]);

  const handleGenerate = useCallback(() => {
    const result = generateNumbers(min, max, count, allowDuplicates, sortResults);
    setNumbers(result);
  }, [min, max, count, allowDuplicates, sortResults]);

  const handleRollDice = useCallback(() => {
    setDiceResults(rollDice(numDice, diceSides));
  }, [numDice, diceSides]);

  const handleFlipCoin = useCallback(() => {
    setCoinFlipping(true);
    // Quick animation feel
    let flips = 0;
    const interval = setInterval(() => {
      const result = getSecureRandom(0, 1) === 0 ? "heads" : "tails";
      setCoinResult(result);
      flips++;
      if (flips >= 8) {
        clearInterval(interval);
        const finalResult = getSecureRandom(0, 1) === 0 ? "heads" : "tails";
        setCoinResult(finalResult);
        setFlipHistory((prev) => [...prev, finalResult]);
        setCoinFlipping(false);
      }
    }, 80);
  }, []);

  const diceTotal = diceResults.reduce((sum, d) => sum + d, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Random Number Generator
      </h1>
      <p className="text-gray-600 mb-6">
        Generate cryptographically random numbers, roll dice, or flip coins. All
        randomness is generated locally using your browser&apos;s secure crypto
        API.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Random Number Generator */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Number Generator
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Minimum
            </label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value, 10) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Maximum
            </label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value, 10) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Count (1-100)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) =>
                setCount(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">Allow duplicates</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sortResults}
              onChange={(e) => setSortResults(e.target.checked)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">Sort results</span>
          </label>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm cursor-pointer"
        >
          Generate
        </button>

        {numbers.length > 0 && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {numbers.map((n, i) => (
                <span
                  key={i}
                  className="inline-block bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-mono text-sm font-semibold text-blue-700"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dice Roller */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dice Roller
        </h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Number of Dice (1-10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={numDice}
              onChange={(e) =>
                setNumDice(Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1)))
              }
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sides
            </label>
            <div className="flex gap-1">
              {DICE_SIDES.map((s) => (
                <button
                  key={s}
                  onClick={() => setDiceSides(s)}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                    diceSides === s
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  d{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleRollDice}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm cursor-pointer"
        >
          Roll {numDice}d{diceSides}
        </button>

        {diceResults.length > 0 && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-3 items-center mb-3">
              {diceResults.map((d, i) => (
                <span
                  key={i}
                  className="inline-flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-300 rounded-lg font-mono text-lg font-bold text-gray-800 shadow-sm"
                >
                  {d}
                </span>
              ))}
            </div>
            {diceResults.length > 1 && (
              <p className="text-sm text-gray-600">
                Total:{" "}
                <span className="font-bold text-gray-900">{diceTotal}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Coin Flipper */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Coin Flipper
        </h2>
        <button
          onClick={handleFlipCoin}
          disabled={coinFlipping}
          className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm disabled:opacity-50 cursor-pointer"
        >
          {coinFlipping ? "Flipping..." : "Flip Coin"}
        </button>

        {coinResult && (
          <div className="mt-4 flex flex-col items-center">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                coinResult === "heads" ? "bg-yellow-500" : "bg-gray-500"
              } ${coinFlipping ? "animate-pulse" : ""}`}
            >
              {coinResult === "heads" ? "H" : "T"}
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-800 capitalize">
              {coinResult}
            </p>
          </div>
        )}

        {flipHistory.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">
              History ({flipHistory.length} flips &mdash;{" "}
              {flipHistory.filter((f) => f === "heads").length} heads,{" "}
              {flipHistory.filter((f) => f === "tails").length} tails)
            </p>
            <div className="flex flex-wrap gap-1">
              {flipHistory.map((f, i) => (
                <span
                  key={i}
                  className={`inline-block w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${
                    f === "heads" ? "bg-yellow-500" : "bg-gray-400"
                  }`}
                  title={f}
                >
                  {f === "heads" ? "H" : "T"}
                </span>
              ))}
            </div>
            <button
              onClick={() => { setFlipHistory([]); setCoinResult(null); }}
              className="mt-2 text-xs text-red-500 hover:text-red-700 cursor-pointer"
            >
              Clear history
            </button>
          </div>
        )}
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Tool
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          All randomness is generated using the Web Crypto API
          (crypto.getRandomValues), making it cryptographically secure. Generate
          numbers in any range with options for unique values and sorting. The
          dice roller supports standard RPG dice (d4, d6, d8, d10, d12, d20)
          with up to 10 dice at once. The coin flipper includes a visual
          animation and running history with head/tail counts.
        </p>
      </section>
    </div>
  );
}
