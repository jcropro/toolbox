"use client";

import { useState, useMemo } from "react";

type Alignment = "left" | "center" | "right";

export function MarkdownTableTool() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [cells, setCells] = useState<string[][]>(() => createGrid(3, 3));
  const [alignments, setAlignments] = useState<Alignment[]>(() => Array(3).fill("left"));
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  function createGrid(r: number, c: number, existing?: string[][]): string[][] {
    const grid: string[][] = [];
    for (let i = 0; i < r; i++) {
      const row: string[] = [];
      for (let j = 0; j < c; j++) {
        row.push(existing && existing[i] && existing[i][j] !== undefined ? existing[i][j] : "");
      }
      grid.push(row);
    }
    return grid;
  }

  const updateDimensions = (newRows: number, newCols: number) => {
    const r = Math.max(1, Math.min(20, newRows));
    const c = Math.max(1, Math.min(20, newCols));
    setRows(r);
    setCols(c);
    setCells(createGrid(r, c, cells));
    setAlignments((prev) => {
      const a = [...prev];
      while (a.length < c) a.push("left");
      return a.slice(0, c);
    });
  };

  const updateCell = (row: number, col: number, value: string) => {
    setCells((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  };

  const cycleAlignment = (col: number) => {
    setAlignments((prev) => {
      const next = [...prev];
      const order: Alignment[] = ["left", "center", "right"];
      const idx = order.indexOf(next[col]);
      next[col] = order[(idx + 1) % 3];
      return next;
    });
  };

  const markdownOutput = useMemo(() => {
    if (cells.length === 0 || cells[0].length === 0) return "";

    const colWidths: number[] = [];
    for (let c = 0; c < cols; c++) {
      let maxW = 3;
      for (let r = 0; r < rows; r++) {
        maxW = Math.max(maxW, (cells[r]?.[c] || "").length);
      }
      colWidths.push(maxW);
    }

    const padCell = (text: string, width: number, align: Alignment) => {
      const pad = width - text.length;
      if (pad <= 0) return text;
      if (align === "center") {
        const left = Math.floor(pad / 2);
        const right = pad - left;
        return " ".repeat(left) + text + " ".repeat(right);
      }
      if (align === "right") return " ".repeat(pad) + text;
      return text + " ".repeat(pad);
    };

    const buildRow = (rowData: string[]) => {
      return (
        "| " +
        rowData
          .map((cell, c) => padCell(cell || "", colWidths[c], alignments[c] || "left"))
          .join(" | ") +
        " |"
      );
    };

    const headerRow = buildRow(cells[0]);

    const separatorRow =
      "| " +
      colWidths
        .map((w, c) => {
          const align = alignments[c] || "left";
          const inner = "-".repeat(Math.max(w, 3));
          if (align === "center") return ":" + inner.slice(1, -1) + ":";
          if (align === "right") return inner.slice(0, -1) + ":";
          return inner;
        })
        .join(" | ") +
      " |";

    const dataRows = cells.slice(1).map((row) => buildRow(row));

    return [headerRow, separatorRow, ...dataRows].join("\n");
  }, [cells, rows, cols, alignments]);

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const importCSV = () => {
    const text = importText.trim();
    if (!text) return;

    const delimiter = text.includes("\t") ? "\t" : ",";
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const parsed = lines.map((line) => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });

    const maxCols = Math.max(...parsed.map((r) => r.length));
    const newRows = parsed.length;
    const normalised = parsed.map((r) => {
      while (r.length < maxCols) r.push("");
      return r;
    });

    setRows(newRows);
    setCols(maxCols);
    setCells(normalised);
    setAlignments(Array(maxCols).fill("left"));
    setShowImport(false);
    setImportText("");
  };

  const clearTable = () => {
    setCells(createGrid(rows, cols));
  };

  const alignIcon = (a: Alignment) => {
    if (a === "left") return "\u2190";
    if (a === "center") return "\u2194";
    return "\u2192";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Markdown Table Generator</h1>
      <p className="text-gray-600 mb-6">
        Build markdown tables with a visual grid editor. Set alignment per column, import CSV or TSV
        data, and copy the generated markdown output.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Columns:</label>
          <input
            type="number"
            value={cols}
            onChange={(e) => updateDimensions(rows, Number(e.target.value))}
            min={1}
            max={20}
            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rows:</label>
          <input
            type="number"
            value={rows}
            onChange={(e) => updateDimensions(Number(e.target.value), cols)}
            min={1}
            max={20}
            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={clearTable}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Clear
        </button>
        <button
          onClick={() => setShowImport(!showImport)}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          {showImport ? "Hide Import" : "Import CSV/TSV"}
        </button>
      </div>

      {/* Import Panel */}
      {showImport && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Paste CSV or TSV data below. Tab-separated values are auto-detected.
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={"Name, Age, City\nAlice, 30, NYC\nBob, 25, LA"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={importCSV}
            disabled={!importText.trim()}
            className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Import
          </button>
        </div>
      )}

      {/* Grid Editor */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-8 bg-gray-50 border-b border-r border-gray-200"></th>
              {Array.from({ length: cols }, (_, c) => (
                <th
                  key={c}
                  className="bg-gray-50 border-b border-r border-gray-200 px-1 py-2 text-xs text-gray-500"
                >
                  <button
                    onClick={() => cycleAlignment(c)}
                    className="px-2 py-0.5 rounded hover:bg-gray-200 transition text-xs"
                    title={`Alignment: ${alignments[c]} (click to cycle)`}
                  >
                    {alignIcon(alignments[c])} {alignments[c]}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, r) => (
              <tr key={r}>
                <td className="bg-gray-50 border-b border-r border-gray-200 text-center text-xs text-gray-400 w-8 py-1">
                  {r === 0 ? "H" : r}
                </td>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`border-b border-r border-gray-200 p-0 ${
                      r === 0 ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                      className={`w-full px-2 py-2 text-sm border-0 focus:ring-2 focus:ring-inset focus:ring-blue-500 min-w-[80px] ${
                        r === 0 ? "bg-blue-50 font-semibold" : "bg-white"
                      }`}
                      placeholder={r === 0 ? `Header ${c + 1}` : ""}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Markdown Output */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Markdown Output</h2>
          <button
            onClick={copyMarkdown}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {copied ? "Copied!" : "Copy Markdown"}
          </button>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre">
          {markdownOutput}
        </pre>
      </div>

      {/* Preview */}
      {markdownOutput && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Preview</h2>
          <div className="overflow-x-auto">
            <table className="border-collapse text-sm">
              <thead>
                <tr>
                  {cells[0]?.map((header, c) => (
                    <th
                      key={c}
                      className={`border border-gray-300 px-3 py-2 bg-gray-50 font-semibold ${
                        alignments[c] === "center"
                          ? "text-center"
                          : alignments[c] === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {header || "\u00A0"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cells.slice(1).map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`border border-gray-300 px-3 py-2 ${
                          alignments[c] === "center"
                            ? "text-center"
                            : alignments[c] === "right"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {cell || "\u00A0"}
                      </td>
                    ))}
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
    </div>
  );
}
