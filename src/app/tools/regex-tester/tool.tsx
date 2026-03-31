"use client";

import { useState, useMemo } from "react";

interface MatchDetail {
  index: number;
  match: string;
  groups: string[];
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  const result = useMemo(() => {
    if (!pattern || !testString) {
      return { error: null, matches: [] as MatchDetail[], highlighted: testString };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches: MatchDetail[] = [];

      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        while ((m = regex.exec(testString)) !== null) {
          matches.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
          if (m[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        const m = regex.exec(testString);
        if (m) {
          matches.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
        }
      }

      // Build highlighted HTML
      let highlighted = "";
      let lastIndex = 0;
      const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

      for (const match of sortedMatches) {
        if (match.index < lastIndex) continue;
        highlighted += escapeHtml(testString.slice(lastIndex, match.index));
        highlighted += `<mark class="bg-yellow-300 text-yellow-900 rounded px-0.5">${escapeHtml(match.match)}</mark>`;
        lastIndex = match.index + match.match.length;
      }
      highlighted += escapeHtml(testString.slice(lastIndex));

      return { error: null, matches, highlighted };
    } catch (e) {
      return {
        error: (e as Error).message,
        matches: [] as MatchDetail[],
        highlighted: escapeHtml(testString),
      };
    }
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Regex Tester</h1>
      <p className="text-gray-600 mb-6">
        Test regular expressions with real-time match highlighting, capture
        groups, and detailed match information. Runs entirely in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Pattern input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Regular Expression Pattern
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <span className="pl-3 text-gray-400 font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 p-2 font-mono text-base focus:outline-none bg-transparent"
            />
            <span className="pr-3 text-gray-400 font-mono">/{flags}</span>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Flags
        </label>
        <div className="flex gap-2 flex-wrap">
          {[
            { flag: "g", label: "Global", desc: "Find all matches" },
            { flag: "i", label: "Case Insensitive", desc: "Ignore case" },
            { flag: "m", label: "Multiline", desc: "^ and $ match line boundaries" },
            { flag: "s", label: "Dotall", desc: ". matches newlines" },
          ].map(({ flag, label, desc }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                flags.includes(flag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={desc}
            >
              {flag} &mdash; {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {result.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {result.error}
        </div>
      )}

      {/* Test string */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Test String
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-y text-base font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>

      {/* Highlighted result */}
      {testString && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matches Highlighted
          </label>
          <div
            className="w-full p-4 border border-gray-300 rounded-lg bg-white font-mono text-base whitespace-pre-wrap break-all min-h-[60px]"
            dangerouslySetInnerHTML={{ __html: result.highlighted }}
          />
        </div>
      )}

      {/* Match count */}
      <div className="mb-4 flex items-center gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <span className="text-sm text-blue-700 font-medium">
            {result.matches.length} match{result.matches.length !== 1 ? "es" : ""} found
          </span>
        </div>
      </div>

      {/* Match details */}
      {result.matches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Match Details
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {result.matches.map((match, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-start gap-4">
                  <span className="text-xs text-gray-400 font-mono min-w-[50px]">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="text-gray-500">Match:</span>{" "}
                      <code className="bg-yellow-100 px-1.5 py-0.5 rounded text-yellow-800 font-mono">
                        {match.match}
                      </code>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Index: {match.index}
                    </div>
                    {match.groups.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Capture Groups:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.groups.map((group, gi) => (
                            <span
                              key={gi}
                              className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm font-mono"
                            >
                              ${gi + 1}: {group ?? "undefined"}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          How to Use This Regex Tester
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Enter a regular expression pattern and test string to see matches
          highlighted in real time. Toggle flags to control matching behavior:
          global (g) finds all matches, case insensitive (i) ignores letter
          case, multiline (m) makes ^ and $ match line boundaries, and dotall
          (s) makes . match newlines. Capture groups are displayed for each
          match. Everything runs in your browser &mdash; no data is sent to any
          server.
        </p>
      </section>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
