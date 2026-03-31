"use client";

import { useState, useCallback, useMemo } from "react";

interface Preset {
  label: string;
  w: number;
  h: number;
}

const PRESETS: Preset[] = [
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "1:1", w: 1, h: 1 },
  { label: "21:9", w: 21, h: 9 },
  { label: "9:16", w: 9, h: 16 },
  { label: "3:2", w: 3, h: 2 },
  { label: "5:4", w: 5, h: 4 },
  { label: "2:1", w: 2, h: 1 },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyRatio(w: number, h: number): { rw: number; rh: number } {
  if (!w || !h || w <= 0 || h <= 0) return { rw: 0, rh: 0 };
  const d = gcd(w, h);
  return { rw: w / d, rh: h / d };
}

export function AspectRatioTool() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [locked, setLocked] = useState(false);
  const [lockedRatio, setLockedRatio] = useState<{ w: number; h: number } | null>(null);
  const [lastChanged, setLastChanged] = useState<"width" | "height">("width");

  const ratio = useMemo(() => simplifyRatio(width, height), [width, height]);
  const decimalRatio = useMemo(() => {
    if (!height || height <= 0) return 0;
    return width / height;
  }, [width, height]);

  const handleLockToggle = useCallback(() => {
    if (!locked) {
      // Locking: save current ratio
      const r = simplifyRatio(width, height);
      if (r.rw > 0 && r.rh > 0) {
        setLockedRatio({ w: r.rw, h: r.rh });
        setLocked(true);
      }
    } else {
      setLocked(false);
      setLockedRatio(null);
    }
  }, [locked, width, height]);

  const handleWidthChange = useCallback(
    (val: string) => {
      const w = parseInt(val, 10);
      if (isNaN(w) || w < 0) {
        setWidth(0);
        return;
      }
      setWidth(w);
      setLastChanged("width");
      if (locked && lockedRatio && lockedRatio.w > 0) {
        setHeight(Math.round((w * lockedRatio.h) / lockedRatio.w));
      }
    },
    [locked, lockedRatio]
  );

  const handleHeightChange = useCallback(
    (val: string) => {
      const h = parseInt(val, 10);
      if (isNaN(h) || h < 0) {
        setHeight(0);
        return;
      }
      setHeight(h);
      setLastChanged("height");
      if (locked && lockedRatio && lockedRatio.h > 0) {
        setWidth(Math.round((h * lockedRatio.w) / lockedRatio.h));
      }
    },
    [locked, lockedRatio]
  );

  const handlePreset = useCallback(
    (preset: Preset) => {
      const r = { w: preset.w, h: preset.h };
      setLockedRatio(r);
      setLocked(true);
      if (lastChanged === "width" && width > 0) {
        setHeight(Math.round((width * r.h) / r.w));
      } else if (height > 0) {
        setWidth(Math.round((height * r.w) / r.h));
      } else {
        // Default dimensions based on preset
        setWidth(preset.w * 120);
        setHeight(preset.h * 120);
      }
    },
    [width, height, lastChanged]
  );

  const previewMaxW = 320;
  const previewMaxH = 200;
  const previewScale = useMemo(() => {
    if (!width || !height || width <= 0 || height <= 0) return { w: 0, h: 0 };
    const scaleW = previewMaxW / width;
    const scaleH = previewMaxH / height;
    const scale = Math.min(scaleW, scaleH);
    return { w: Math.round(width * scale), h: Math.round(height * scale) };
  }, [width, height]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Aspect Ratio Calculator</h1>
      <p className="text-gray-600 mb-6">
        Calculate aspect ratios for images, videos, and screens. Lock a ratio and resize
        proportionally, or pick from common presets.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {/* Presets */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Common Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors cursor-pointer ${
                  locked && lockedRatio?.w === p.w && lockedRatio?.h === p.h
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Width and Height inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
            <input
              type="number"
              value={width || ""}
              onChange={(e) => handleWidthChange(e.target.value)}
              min={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Width"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
            <input
              type="number"
              value={height || ""}
              onChange={(e) => handleHeightChange(e.target.value)}
              min={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Height"
            />
          </div>
        </div>

        {/* Lock toggle */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={handleLockToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
              locked
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {locked ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              )}
            </svg>
            {locked ? "Ratio Locked" : "Lock Ratio"}
          </button>
          {locked && lockedRatio && (
            <span className="text-sm text-gray-500">
              Locked at {lockedRatio.w}:{lockedRatio.h}
            </span>
          )}
        </div>

        {/* Results */}
        {width > 0 && height > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <span className="text-xs text-gray-500 block mb-1">Aspect Ratio</span>
              <span className="text-2xl font-bold text-gray-900">{ratio.rw}:{ratio.rh}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <span className="text-xs text-gray-500 block mb-1">Decimal</span>
              <span className="text-2xl font-bold text-gray-900">{decimalRatio.toFixed(4)}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <span className="text-xs text-gray-500 block mb-1">Pixels</span>
              <span className="text-2xl font-bold text-gray-900">{(width * height).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual preview */}
      {width > 0 && height > 0 && previewScale.w > 0 && previewScale.h > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="flex items-center justify-center" style={{ minHeight: previewMaxH + 20 }}>
            <div
              className="border-2 border-blue-400 bg-blue-50 rounded flex items-center justify-center"
              style={{ width: previewScale.w, height: previewScale.h }}
            >
              <span className="text-xs text-blue-600 font-medium">
                {width} x {height}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Common resolutions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Screen Resolutions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {[
            { name: "HD (720p)", w: 1280, h: 720 },
            { name: "Full HD (1080p)", w: 1920, h: 1080 },
            { name: "2K (1440p)", w: 2560, h: 1440 },
            { name: "4K (2160p)", w: 3840, h: 2160 },
            { name: "Instagram Post", w: 1080, h: 1080 },
            { name: "Instagram Story", w: 1080, h: 1920 },
            { name: "Twitter Post", w: 1200, h: 675 },
            { name: "Facebook Cover", w: 820, h: 312 },
            { name: "YouTube Thumbnail", w: 1280, h: 720 },
          ].map((res) => {
            const r = simplifyRatio(res.w, res.h);
            return (
              <button
                key={res.name}
                onClick={() => {
                  setWidth(res.w);
                  setHeight(res.h);
                  setLocked(false);
                  setLockedRatio(null);
                }}
                className="flex justify-between items-center p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer text-left"
              >
                <span className="text-gray-700">{res.name}</span>
                <span className="text-gray-400 font-mono text-xs">
                  {res.w}x{res.h} ({r.rw}:{r.rh})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About Aspect Ratios</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          An aspect ratio describes the proportional relationship between an image&apos;s width
          and height. Common ratios include 16:9 for widescreen video, 4:3 for older TVs and
          presentations, 1:1 for square social media posts, and 9:16 for vertical phone content.
          Locking a ratio lets you resize one dimension while automatically calculating the other
          to maintain proportion. All calculations run locally in your browser.
        </p>
      </section>
    </div>
  );
}
