"use client";

import { useState, useCallback } from "react";

interface ColorState {
  hex: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  c: number;
  m: number;
  y: number;
  k: number;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  let full = clean;
  if (full.length === 3) {
    full = full[0] + full[0] + full[1] + full[1] + full[2] + full[2];
  }
  if (full.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.substring(0, 2), 16),
    g: parseInt(full.substring(2, 4), 16),
    b: parseInt(full.substring(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let rn = 0,
    gn = 0,
    bn = 0;
  if (h < 60) {
    rn = c; gn = x; bn = 0;
  } else if (h < 120) {
    rn = x; gn = c; bn = 0;
  } else if (h < 180) {
    rn = 0; gn = c; bn = x;
  } else if (h < 240) {
    rn = 0; gn = x; bn = c;
  } else if (h < 300) {
    rn = x; gn = 0; bn = c;
  } else {
    rn = c; gn = 0; bn = x;
  }
  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

function rgbToCmyk(r: number, g: number, b: number) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  const c = (1 - rn - k) / (1 - k);
  const cm = (1 - gn - k) / (1 - k);
  const cy = (1 - bn - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(cm * 100),
    y: Math.round(cy * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number) {
  const cn = c / 100;
  const mn = m / 100;
  const yn = y / 100;
  const kn = k / 100;
  return {
    r: Math.round(255 * (1 - cn) * (1 - kn)),
    g: Math.round(255 * (1 - mn) * (1 - kn)),
    b: Math.round(255 * (1 - yn) * (1 - kn)),
  };
}

function fromRgb(r: number, g: number, b: number): ColorState {
  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);
  return { hex, r, g, b, ...hsl, ...cmyk };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function ColorConverterTool() {
  const [color, setColor] = useState<ColorState>(fromRgb(59, 130, 246));
  const [hexInput, setHexInput] = useState(color.hex);
  const [rgbInput, setRgbInput] = useState(`${color.r}, ${color.g}, ${color.b}`);
  const [hslInput, setHslInput] = useState(`${color.h}, ${color.s}%, ${color.l}%`);
  const [cmykInput, setCmykInput] = useState(`${color.c}%, ${color.m}%, ${color.y}%, ${color.k}%`);

  const updateAll = useCallback((c: ColorState) => {
    setColor(c);
    setHexInput(c.hex);
    setRgbInput(`${c.r}, ${c.g}, ${c.b}`);
    setHslInput(`${c.h}, ${c.s}%, ${c.l}%`);
    setCmykInput(`${c.c}%, ${c.m}%, ${c.y}%, ${c.k}%`);
  }, []);

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgb = hexToRgb(e.target.value);
    if (rgb) updateAll(fromRgb(rgb.r, rgb.g, rgb.b));
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const clean = val.startsWith("#") ? val : "#" + val;
    const rgb = hexToRgb(clean);
    if (rgb) {
      const c = fromRgb(rgb.r, rgb.g, rgb.b);
      setColor(c);
      setRgbInput(`${c.r}, ${c.g}, ${c.b}`);
      setHslInput(`${c.h}, ${c.s}%, ${c.l}%`);
      setCmykInput(`${c.c}%, ${c.m}%, ${c.y}%, ${c.k}%`);
    }
  };

  const handleRgbChange = (val: string) => {
    setRgbInput(val);
    const parts = val.split(/[\s,]+/).map(Number);
    if (parts.length >= 3 && parts.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
      const c = fromRgb(parts[0], parts[1], parts[2]);
      setColor(c);
      setHexInput(c.hex);
      setHslInput(`${c.h}, ${c.s}%, ${c.l}%`);
      setCmykInput(`${c.c}%, ${c.m}%, ${c.y}%, ${c.k}%`);
    }
  };

  const handleHslChange = (val: string) => {
    setHslInput(val);
    const parts = val.replace(/%/g, "").split(/[\s,]+/).map(Number);
    if (
      parts.length >= 3 &&
      !isNaN(parts[0]) && parts[0] >= 0 && parts[0] <= 360 &&
      !isNaN(parts[1]) && parts[1] >= 0 && parts[1] <= 100 &&
      !isNaN(parts[2]) && parts[2] >= 0 && parts[2] <= 100
    ) {
      const rgb = hslToRgb(parts[0], parts[1], parts[2]);
      const c = fromRgb(rgb.r, rgb.g, rgb.b);
      setColor(c);
      setHexInput(c.hex);
      setRgbInput(`${c.r}, ${c.g}, ${c.b}`);
      setCmykInput(`${c.c}%, ${c.m}%, ${c.y}%, ${c.k}%`);
    }
  };

  const handleCmykChange = (val: string) => {
    setCmykInput(val);
    const parts = val.replace(/%/g, "").split(/[\s,]+/).map(Number);
    if (
      parts.length >= 4 &&
      parts.every((n) => !isNaN(n) && n >= 0 && n <= 100)
    ) {
      const rgb = cmykToRgb(parts[0], parts[1], parts[2], parts[3]);
      const c = fromRgb(rgb.r, rgb.g, rgb.b);
      setColor(c);
      setHexInput(c.hex);
      setRgbInput(`${c.r}, ${c.g}, ${c.b}`);
      setHslInput(`${c.h}, ${c.s}%, ${c.l}%`);
    }
  };

  const hexStr = color.hex.toUpperCase();
  const rgbStr = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const hslStr = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
  const cmykStr = `cmyk(${color.c}%, ${color.m}%, ${color.y}%, ${color.k}%)`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Color Converter & Picker</h1>
      <p className="text-gray-600 mb-6">
        Pick a color or type in any format (HEX, RGB, HSL, CMYK) and instantly see it
        converted to all other formats. Click copy to grab any value.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Color Picker + Swatch */}
          <div className="flex flex-col items-center gap-4">
            <input
              type="color"
              value={color.hex}
              onChange={handlePickerChange}
              className="w-32 h-32 cursor-pointer border-0 rounded-lg"
              title="Pick a color"
            />
            <div
              className="w-32 h-16 rounded-lg border border-gray-300 shadow-inner"
              style={{ backgroundColor: color.hex }}
            />
          </div>

          {/* Format inputs */}
          <div className="flex-1 grid gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">HEX</label>
                <CopyButton text={hexStr} />
              </div>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#3B82F6"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">RGB</label>
                <CopyButton text={rgbStr} />
              </div>
              <input
                type="text"
                value={rgbInput}
                onChange={(e) => handleRgbChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="59, 130, 246"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">HSL</label>
                <CopyButton text={hslStr} />
              </div>
              <input
                type="text"
                value={hslInput}
                onChange={(e) => handleHslChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="217, 91%, 60%"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">CMYK</label>
                <CopyButton text={cmykStr} />
              </div>
              <input
                type="text"
                value={cmykInput}
                onChange={(e) => handleCmykChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="76%, 47%, 0%, 4%"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>
    </div>
  );
}
