"use client";

import { useState, useMemo, useCallback } from "react";

interface TreeNodeProps {
  keyName: string;
  value: unknown;
  path: string[];
  onSelect: (path: string[]) => void;
  selectedPath: string | null;
  searchTerm: string;
  defaultExpanded?: boolean;
}

function isExpandable(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === "object";
}

function buildDotPath(path: string[]): string {
  if (path.length === 0) return "$";
  return (
    "$" +
    path
      .map((p) => {
        if (/^\d+$/.test(p)) return `[${p}]`;
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(p)) return `.${p}`;
        return `["${p.replace(/"/g, '\\"')}"]`;
      })
      .join("")
  );
}

function buildBracketPath(path: string[]): string {
  if (path.length === 0) return "$";
  return (
    "$" +
    path
      .map((p) => {
        if (/^\d+$/.test(p)) return `[${p}]`;
        return `["${p.replace(/"/g, '\\"')}"]`;
      })
      .join("")
  );
}

function matchesSearch(value: unknown, term: string): boolean {
  if (!term) return false;
  const lower = term.toLowerCase();
  if (typeof value === "string" && value.toLowerCase().includes(lower)) return true;
  if (typeof value === "number" && String(value).includes(term)) return true;
  if (typeof value === "boolean" && String(value) === lower) return true;
  if (value === null && "null".includes(lower)) return true;
  return false;
}

function TreeNode({
  keyName,
  value,
  path,
  onSelect,
  selectedPath,
  searchTerm,
  defaultExpanded = false,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const dotPath = buildDotPath(path);
  const isSelected = selectedPath === dotPath;

  const isMatch = matchesSearch(value, searchTerm) || (searchTerm && keyName.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isExpandable(value)) {
    const entries = Array.isArray(value)
      ? value.map((v, i) => [String(i), v] as const)
      : Object.entries(value as Record<string, unknown>);
    const typeLabel = Array.isArray(value)
      ? `Array(${entries.length})`
      : `Object{${entries.length}}`;

    return (
      <div className="ml-4">
        <div
          className={`flex items-center gap-1 py-0.5 cursor-pointer rounded px-1 -ml-1 ${
            isSelected ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
          onClick={() => {
            onSelect(path);
            setExpanded(!expanded);
          }}
        >
          <span className="text-gray-400 text-xs w-4 text-center select-none">
            {expanded ? "\u25BC" : "\u25B6"}
          </span>
          <span className={`font-medium ${isMatch ? "bg-yellow-200" : "text-purple-700"}`}>
            {keyName}
          </span>
          <span className="text-gray-400 text-xs ml-1">{typeLabel}</span>
        </div>
        {expanded && (
          <div>
            {entries.map(([k, v]) => (
              <TreeNode
                key={k}
                keyName={k}
                value={v}
                path={[...path, k]}
                onSelect={onSelect}
                selectedPath={selectedPath}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  let displayValue: string;
  let valueClass: string;
  if (typeof value === "string") {
    displayValue = `"${value}"`;
    valueClass = "text-green-700";
  } else if (typeof value === "number") {
    displayValue = String(value);
    valueClass = "text-blue-700";
  } else if (typeof value === "boolean") {
    displayValue = String(value);
    valueClass = "text-orange-600";
  } else {
    displayValue = "null";
    valueClass = "text-gray-500";
  }

  return (
    <div className="ml-4">
      <div
        className={`flex items-center gap-1 py-0.5 cursor-pointer rounded px-1 -ml-1 ${
          isSelected ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
        onClick={() => onSelect(path)}
      >
        <span className="w-4" />
        <span className={`font-medium ${isMatch ? "bg-yellow-200" : "text-purple-700"}`}>
          {keyName}
        </span>
        <span className="text-gray-400 mx-1">:</span>
        <span className={`${valueClass} ${isMatch ? "bg-yellow-200" : ""} truncate max-w-xs`}>
          {displayValue}
        </span>
      </div>
    </div>
  );
}

export function JsonPathTool() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "address": {\n    "street": "123 Main St",\n    "city": "Springfield"\n  },\n  "hobbies": ["reading", "coding", "hiking"]\n}');
  const [selectedPath, setSelectedPath] = useState<string[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = useMemo(() => {
    try {
      const result = JSON.parse(input);
      setParseError(null);
      return result;
    } catch (e) {
      setParseError((e as Error).message);
      return null;
    }
  }, [input]);

  const dotPath = selectedPath ? buildDotPath(selectedPath) : null;
  const bracketPath = selectedPath ? buildBracketPath(selectedPath) : null;

  const selectedValue = useMemo(() => {
    if (!selectedPath || parsed === null) return undefined;
    let current: unknown = parsed;
    for (const key of selectedPath) {
      if (current === null || typeof current !== "object") return undefined;
      current = (current as Record<string, unknown>)[key];
    }
    return current;
  }, [selectedPath, parsed]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSelect = useCallback((path: string[]) => {
    setSelectedPath(path);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">JSON Path Finder</h1>
      <p className="text-gray-600 mb-6">
        Paste your JSON and click any value in the tree to see its path in dot notation and bracket
        notation. Use the search bar to find values quickly.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Input Panel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full h-80 border rounded-lg px-3 py-3 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              parseError ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Paste your JSON here..."
            spellCheck={false}
          />
          {parseError && (
            <p className="text-red-500 text-xs mt-1">Parse error: {parseError}</p>
          )}
        </div>

        {/* Tree Panel */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Tree View</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search values..."
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="h-80 border border-gray-300 rounded-lg p-3 overflow-auto bg-white font-mono text-sm">
            {parsed !== null ? (
              <TreeNode
                keyName="$"
                value={parsed}
                path={[]}
                onSelect={handleSelect}
                selectedPath={dotPath}
                searchTerm={searchTerm}
                defaultExpanded
              />
            ) : (
              <p className="text-gray-400 text-center mt-8">
                Enter valid JSON to see the tree view
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Path Display */}
      {selectedPath !== null && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Selected Path</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 w-16 shrink-0">Dot:</span>
              <code className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-gray-800 truncate">
                {dotPath}
              </code>
              <button
                onClick={() => copyToClipboard(dotPath!, "dot")}
                className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shrink-0"
              >
                {copied === "dot" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 w-16 shrink-0">Bracket:</span>
              <code className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-gray-800 truncate">
                {bracketPath}
              </code>
              <button
                onClick={() => copyToClipboard(bracketPath!, "bracket")}
                className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shrink-0"
              >
                {copied === "bracket" ? "Copied!" : "Copy"}
              </button>
            </div>
            {selectedValue !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 w-16 shrink-0">Value:</span>
                <code className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-gray-800 truncate">
                  {typeof selectedValue === "object"
                    ? JSON.stringify(selectedValue)
                    : String(selectedValue)}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      typeof selectedValue === "object"
                        ? JSON.stringify(selectedValue, null, 2)
                        : String(selectedValue),
                      "value"
                    )
                  }
                  className="px-3 py-2 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shrink-0"
                >
                  {copied === "value" ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
