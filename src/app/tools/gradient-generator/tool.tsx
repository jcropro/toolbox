"use client";

import { useState, useCallback } from "react";

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

const DIRECTIONS = [
  { label: "To Right", value: "to right" },
  { label: "To Left", value: "to left" },
  { label: "To Bottom", value: "to bottom" },
  { label: "To Top", value: "to top" },
  { label: "To Bottom Right", value: "to bottom right" },
  { label: "To Bottom Left", value: "to bottom left" },
  { label: "To Top Right", value: "to top right" },
  { label: "To Top Left", value: "to top left" },
  { label: "Radial", value: "radial" },
];

let nextId = 3;

export function GradientGeneratorTool() {
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: "#667eea", position: 0 },
    { id: 2, color: "#764ba2", position: 100 },
  ]);
  const [direction, setDirection] = useState("to right");
  const [copied, setCopied] = useState(false);

  const gradientCSS = (() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");
    if (direction === "radial") {
      return `radial-gradient(circle, ${stopsStr})`;
    }
    return `linear-gradient(${direction}, ${stopsStr})`;
  })();

  const fullCSS = `background: ${gradientCSS};`;

  const addStop = useCallback(() => {
    const newPos = 50;
    setStops((prev) => [
      ...prev,
      { id: nextId++, color: "#00b4d8", position: newPos },
    ]);
  }, []);

  const removeStop = useCallback(
    (id: number) => {
      if (stops.length <= 2) return;
      setStops((prev) => prev.filter((s) => s.id !== id));
    },
    [stops.length]
  );

  const updateStop = useCallback(
    (id: number, field: "color" | "position", value: string | number) => {
      setStops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullCSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = fullCSS;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullCSS]);

  const randomGradient = useCallback(() => {
    const randomColor = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setStops([
      { id: nextId++, color: randomColor(), position: 0 },
      { id: nextId++, color: randomColor(), position: 100 },
    ]);
    const dirs = DIRECTIONS.map((d) => d.value);
    setDirection(dirs[Math.floor(Math.random() * dirs.length)]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        CSS Gradient Generator
      </h1>
      <p className="text-gray-600 mb-6">
        Design linear and radial gradients with multiple color stops, preview
        them live, and copy the CSS. Runs entirely in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Live preview */}
      <div
        className="w-full h-48 rounded-xl border border-gray-200 mb-6 shadow-inner"
        style={{ background: gradientCSS }}
      />

      {/* Direction */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Direction
        </label>
        <div className="flex flex-wrap gap-2">
          {DIRECTIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => setDirection(d.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                direction === d.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color stops */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Color Stops
          </label>
          <div className="flex gap-2">
            <button
              onClick={addStop}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer"
            >
              + Add Stop
            </button>
            <button
              onClick={randomGradient}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium cursor-pointer"
            >
              Random
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {stops.map((stop) => (
            <div
              key={stop.id}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
            >
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm font-mono bg-white"
              />
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) =>
                    updateStop(stop.id, "position", parseInt(e.target.value))
                  }
                  className="flex-1"
                />
                <span className="text-sm text-gray-500 w-10 text-right font-mono">
                  {stop.position}%
                </span>
              </div>
              <button
                onClick={() => removeStop(stop.id)}
                disabled={stops.length <= 2}
                className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold cursor-pointer px-2"
                title="Remove stop"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CSS output */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CSS Code
        </label>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            {fullCSS}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-xs font-medium cursor-pointer"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          About This Tool
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Create CSS gradients visually with multiple color stops and eight
          directional options plus radial mode. Add, remove, and reposition color
          stops with sliders. Copy the generated CSS directly into your
          stylesheet. Hit &ldquo;Random&rdquo; for instant inspiration.
        </p>
      </section>
    </div>
  );
}
