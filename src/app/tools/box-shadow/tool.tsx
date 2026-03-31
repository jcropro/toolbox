"use client";

import { useState, useCallback } from "react";

interface Shadow {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

let nextId = 2;

function shadowToCSS(s: Shadow): string {
  const rgba = hexToRgba(s.color, s.opacity);
  const insetStr = s.inset ? "inset " : "";
  return `${insetStr}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`;
}

export function BoxShadowTool() {
  const [shadows, setShadows] = useState<Shadow[]>([
    {
      id: 1,
      x: 4,
      y: 4,
      blur: 15,
      spread: 0,
      color: "#000000",
      opacity: 0.25,
      inset: false,
    },
  ]);
  const [previewBg, setPreviewBg] = useState("#ffffff");
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const fullCSS = shadows.map(shadowToCSS).join(",\n        ");
  const cssProperty = `box-shadow: ${shadows.map(shadowToCSS).join(", ")};`;

  const addShadow = useCallback(() => {
    setShadows((prev) => [
      ...prev,
      {
        id: nextId++,
        x: 0,
        y: 4,
        blur: 10,
        spread: 0,
        color: "#000000",
        opacity: 0.15,
        inset: false,
      },
    ]);
  }, []);

  const removeShadow = useCallback(
    (id: number) => {
      if (shadows.length <= 1) return;
      setShadows((prev) => prev.filter((s) => s.id !== id));
    },
    [shadows.length]
  );

  const updateShadow = useCallback(
    (id: number, field: keyof Omit<Shadow, "id">, value: number | string | boolean) => {
      setShadows((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssProperty);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = cssProperty;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [cssProperty]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        CSS Box Shadow Generator
      </h1>
      <p className="text-gray-600 mb-6">
        Build custom CSS box shadows with sliders for offset, blur, spread,
        color, and opacity. Layer multiple shadows and toggle inset mode. Copy
        the CSS with one click.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      {/* Live preview */}
      <div
        className="w-full h-64 rounded-xl border border-gray-200 mb-6 flex items-center justify-center transition-all"
        style={{ backgroundColor: previewBg }}
      >
        <div
          className="w-48 h-48 rounded-xl transition-all"
          style={{
            backgroundColor: boxColor,
            boxShadow: shadows.map(shadowToCSS).join(", "),
          }}
        />
      </div>

      {/* Preview controls */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Background:</label>
          <input
            type="color"
            value={previewBg}
            onChange={(e) => setPreviewBg(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Box color:</label>
          <input
            type="color"
            value={boxColor}
            onChange={(e) => setBoxColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
          />
        </div>
      </div>

      {/* Shadow controls */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Shadows</h2>
        <button
          onClick={addShadow}
          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer"
        >
          + Add Shadow
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {shadows.map((shadow, index) => (
          <div
            key={shadow.id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Shadow {index + 1}
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shadow.inset}
                    onChange={(e) =>
                      updateShadow(shadow.id, "inset", e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  Inset
                </label>
                <button
                  onClick={() => removeShadow(shadow.id)}
                  disabled={shadows.length <= 1}
                  className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* X offset */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Horizontal Offset</span>
                  <span className="font-mono">{shadow.x}px</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={shadow.x}
                  onChange={(e) =>
                    updateShadow(shadow.id, "x", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Y offset */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Vertical Offset</span>
                  <span className="font-mono">{shadow.y}px</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={shadow.y}
                  onChange={(e) =>
                    updateShadow(shadow.id, "y", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Blur */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Blur Radius</span>
                  <span className="font-mono">{shadow.blur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={150}
                  value={shadow.blur}
                  onChange={(e) =>
                    updateShadow(shadow.id, "blur", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Spread */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Spread Radius</span>
                  <span className="font-mono">{shadow.spread}px</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={shadow.spread}
                  onChange={(e) =>
                    updateShadow(shadow.id, "spread", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Color */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Shadow Color</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={shadow.color}
                    onChange={(e) =>
                      updateShadow(shadow.id, "color", e.target.value)
                    }
                    className="w-10 h-8 rounded cursor-pointer border border-gray-300"
                  />
                  <span className="text-sm font-mono text-gray-600">
                    {shadow.color}
                  </span>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Opacity</span>
                  <span className="font-mono">
                    {Math.round(shadow.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(shadow.opacity * 100)}
                  onChange={(e) =>
                    updateShadow(
                      shadow.id,
                      "opacity",
                      parseInt(e.target.value) / 100
                    )
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS output */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CSS Code
        </label>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {`box-shadow: ${fullCSS};`}
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
          Create and preview CSS box shadows with full control over horizontal
          and vertical offset, blur radius, spread radius, color, and opacity.
          Stack multiple shadows, toggle inset mode, and customize the preview
          background and box colors. Copy the generated CSS directly into your
          project.
        </p>
      </section>
    </div>
  );
}
