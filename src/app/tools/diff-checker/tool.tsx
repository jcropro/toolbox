"use client";

import { useState, useCallback } from "react";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
  oldLineNum?: number;
  newLineNum?: number;
}

/**
 * Longest Common Subsequence (LCS) based diff.
 * Computes the LCS table, then backtracks to produce a line-by-line diff.
 */
function computeDiff(original: string, modified: string): DiffLine[] {
  const oldLines = original.split("\n");
  const newLines = modified.split("\n");
  const m = oldLines.length;
  const n = newLines.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to produce diff
  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.push({
        type: "unchanged",
        text: oldLines[i - 1],
        oldLineNum: i,
        newLineNum: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({
        type: "added",
        text: newLines[j - 1],
        newLineNum: j,
      });
      j--;
    } else {
      result.push({
        type: "removed",
        text: oldLines[i - 1],
        oldLineNum: i,
      });
      i--;
    }
  }

  return result.reverse();
}

export function DiffCheckerTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  const handleCompare = useCallback(() => {
    setDiff(computeDiff(original, modified));
  }, [original, modified]);

  const stats = diff
    ? {
        added: diff.filter((d) => d.type === "added").length,
        removed: diff.filter((d) => d.type === "removed").length,
        unchanged: diff.filter((d) => d.type === "unchanged").length,
      }
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Diff Checker</h1>
      <p className="text-gray-600 mb-6">
        Compare two blocks of text and see the differences highlighted line by
        line. Uses the Longest Common Subsequence algorithm for accurate results.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Input textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            className="w-full h-56 p-4 border border-gray-300 rounded-lg resize-y text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modified</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            className="w-full h-56 p-4 border border-gray-300 rounded-lg resize-y text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCompare}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Compare
        </button>
        <button
          onClick={() => {
            setOriginal("");
            setModified("");
            setDiff(null);
          }}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="flex gap-4 mb-4 text-sm">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-200 border border-green-400 inline-block" />
            {stats.added} added
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-200 border border-red-400 inline-block" />
            {stats.removed} removed
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-100 border border-gray-300 inline-block" />
            {stats.unchanged} unchanged
          </span>
        </div>
      )}

      {/* Diff output */}
      {diff && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <tbody>
                {diff.map((line, idx) => (
                  <tr
                    key={idx}
                    className={
                      line.type === "added"
                        ? "bg-green-50"
                        : line.type === "removed"
                        ? "bg-red-50"
                        : ""
                    }
                  >
                    {/* Old line number */}
                    <td className="px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-200 w-12 text-xs">
                      {line.oldLineNum ?? ""}
                    </td>
                    {/* New line number */}
                    <td className="px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-200 w-12 text-xs">
                      {line.newLineNum ?? ""}
                    </td>
                    {/* Indicator */}
                    <td
                      className={`px-2 py-0.5 select-none w-6 text-center font-bold ${
                        line.type === "added"
                          ? "text-green-600"
                          : line.type === "removed"
                          ? "text-red-600"
                          : "text-gray-300"
                      }`}
                    >
                      {line.type === "added"
                        ? "+"
                        : line.type === "removed"
                        ? "-"
                        : " "}
                    </td>
                    {/* Content */}
                    <td
                      className={`px-3 py-0.5 whitespace-pre-wrap ${
                        line.type === "added"
                          ? "text-green-800"
                          : line.type === "removed"
                          ? "text-red-800"
                          : "text-gray-600"
                      }`}
                    >
                      {line.text || "\u00A0"}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Use This Diff Checker</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Paste your original text on the left and the modified version on the
          right, then click Compare. Added lines appear in green, removed lines
          in red, and unchanged lines in gray. Line numbers for both the original
          and modified text are shown for easy reference. Everything runs in your
          browser &mdash; your text is never sent to any server.
        </p>
      </section>
    </div>
  );
}
