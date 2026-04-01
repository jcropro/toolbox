"use client";

import { useState, useCallback } from "react";

interface PaletteColor {
  hex: string;
  locked: boolean;
}

function randomHex(): string {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const val = parseInt(hex.slice(1), 16);
  return { r: (val >> 16) & 255, g: (val >> 8) & 255, b: val & 255 };
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r: rr, g: gg, b: bb } = hexToRgb(hex);
  const r = rr / 255, g = gg / 255, b = bb / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return { h, s, l };
}

function generateHarmony(
  baseHex: string,
  type: "complementary" | "analogous" | "triadic" | "split-complementary"
): string[] {
  const { h, s, l } = hexToHsl(baseHex);
  switch (type) {
    case "complementary":
      return [baseHex, hslToHex(h + 180, s, l)];
    case "analogous":
      return [hslToHex(h - 30, s, l), baseHex, hslToHex(h + 30, s, l)];
    case "triadic":
      return [baseHex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)];
    case "split-complementary":
      return [baseHex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)];
  }
}

function textColorFor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? "#000000" : "#ffffff";
}

export function ColorPaletteTool() {
  const [colors, setColors] = useState<PaletteColor[]>(() =>
    Array.from({ length: 5 }, () => ({ hex: randomHex(), locked: false }))
  );
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [copied, setCopied] = useState("");
  const [harmonyType, setHarmonyType] = useState<
    "complementary" | "analogous" | "triadic" | "split-complementary"
  >("complementary");

  const generate = useCallback(() => {
    setColors((prev) =>
      prev.map((c) => (c.locked ? c : { hex: randomHex(), locked: false }))
    );
  }, []);

  const toggleLock = useCallback((index: number) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  }, []);

  const copyText = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  }, []);

  const cssVars = colors
    .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
    .join("\n");
  const cssBlock = `:root {\n${cssVars}\n}`;

  const harmonyColors = generateHarmony(baseColor, harmonyType);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Color Palette Generator</h1>
      <p className="text-gray-600 mb-6">
        Generate random color palettes, lock your favorites, and explore color
        harmonies. Copy individual colors or export as CSS variables.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Random Palette */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Random Palette</h2>
          <button
            onClick={generate}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Generate
          </button>
        </div>

        <div className="grid grid-cols-5 gap-0 rounded-xl overflow-hidden shadow-lg h-48 mb-4">
          {colors.map((c, i) => {
            const rgb = hexToRgb(c.hex);
            const txtColor = textColorFor(c.hex);
            return (
              <div
                key={i}
                className="relative flex flex-col items-center justify-end pb-4 cursor-pointer group"
                style={{ backgroundColor: c.hex, color: txtColor }}
              >
                <button
                  onClick={() => toggleLock(i)}
                  className="absolute top-3 right-3 text-lg opacity-60 hover:opacity-100 transition"
                  title={c.locked ? "Unlock" : "Lock"}
                >
                  {c.locked ? "\u{1F512}" : "\u{1F513}"}
                </button>
                <span className="font-mono text-sm font-bold">
                  {c.hex.toUpperCase()}
                </span>
                <span className="font-mono text-xs opacity-75">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
                <button
                  onClick={() => copyText(c.hex, `color-${i}`)}
                  className="mt-1 text-xs opacity-0 group-hover:opacity-100 transition underline"
                >
                  {copied === `color-${i}` ? "Copied!" : "Copy HEX"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => copyText(cssBlock, "css")}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition text-sm"
          >
            {copied === "css" ? "Copied!" : "Copy as CSS Variables"}
          </button>
          <button
            onClick={() =>
              copyText(colors.map((c) => c.hex).join(", "), "list")
            }
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm"
          >
            {copied === "list" ? "Copied!" : "Copy HEX List"}
          </button>
        </div>
      </section>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Color Harmonies */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Color Harmonies</h2>
        <div className="flex flex-wrap gap-4 items-end mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setBaseColor(v);
                }}
                className="w-28 px-3 py-2 border border-gray-300 rounded font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harmony Type
            </label>
            <select
              value={harmonyType}
              onChange={(e) => setHarmonyType(e.target.value as typeof harmonyType)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="complementary">Complementary</option>
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="split-complementary">Split-Complementary</option>
            </select>
          </div>
        </div>

        <div className="flex rounded-xl overflow-hidden shadow-lg h-32">
          {harmonyColors.map((hex, i) => {
            const rgb = hexToRgb(hex);
            const txtColor = textColorFor(hex);
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-center group cursor-pointer"
                style={{ backgroundColor: hex, color: txtColor }}
                onClick={() => copyText(hex, `harmony-${i}`)}
              >
                <span className="font-mono text-sm font-bold">
                  {hex.toUpperCase()}
                </span>
                <span className="font-mono text-xs opacity-75">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
                <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition">
                  {copied === `harmony-${i}` ? "Copied!" : "Click to copy"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* CSS Output */}
      <section>
        <h2 className="text-xl font-semibold mb-3">CSS Variables Output</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
          {cssBlock}
        </pre>
      </section>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
