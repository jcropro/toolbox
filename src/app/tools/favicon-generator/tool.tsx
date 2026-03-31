"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const PREVIEW_SIZES = [16, 32, 48, 64, 128, 256];

function drawFavicon(
  canvas: HTMLCanvasElement,
  text: string,
  bgColor: string,
  textColor: string,
  fontSize: number,
  size: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  // Background
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.125);
  ctx.fill();

  // Text
  const scaledFont = (fontSize / 100) * size * 0.7;
  ctx.fillStyle = textColor;
  ctx.font = `bold ${scaledFont}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.slice(0, 2), size / 2, size / 2 + scaledFont * 0.05);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type);
  });
}

// Create ICO format from canvas
function createIcoBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    // Draw to a 32x32 canvas for ICO
    const icoCanvas = document.createElement("canvas");
    icoCanvas.width = 32;
    icoCanvas.height = 32;
    const ctx = icoCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(canvas, 0, 0, 32, 32);
    }

    icoCanvas.toBlob((pngBlob) => {
      if (!pngBlob) {
        resolve(new Blob());
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const pngData = new Uint8Array(reader.result as ArrayBuffer);

        // ICO file format:
        // ICONDIR header (6 bytes)
        // ICONDIRENTRY (16 bytes per image)
        // PNG data
        const icoHeader = new ArrayBuffer(6 + 16 + pngData.length);
        const view = new DataView(icoHeader);

        // ICONDIR
        view.setUint16(0, 0, true); // reserved
        view.setUint16(2, 1, true); // type (1 = ICO)
        view.setUint16(4, 1, true); // count

        // ICONDIRENTRY
        view.setUint8(6, 32); // width (32)
        view.setUint8(7, 32); // height (32)
        view.setUint8(8, 0); // color palette
        view.setUint8(9, 0); // reserved
        view.setUint16(10, 1, true); // color planes
        view.setUint16(12, 32, true); // bits per pixel
        view.setUint32(14, pngData.length, true); // size of PNG data
        view.setUint32(18, 22, true); // offset to PNG data

        // Copy PNG data
        const icoArray = new Uint8Array(icoHeader);
        icoArray.set(pngData, 22);

        resolve(new Blob([icoArray], { type: "image/x-icon" }));
      };
      reader.readAsArrayBuffer(pngBlob);
    }, "image/png");
  });
}

export function FaviconGeneratorTool() {
  const [text, setText] = useState("Ab");
  const [bgColor, setBgColor] = useState("#3b82f6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(70);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  // Redraw when settings change
  useEffect(() => {
    if (mainCanvasRef.current) {
      drawFavicon(mainCanvasRef.current, text, bgColor, textColor, fontSize, 256);
    }
    previewCanvasRefs.current.forEach((canvas, i) => {
      if (canvas) {
        drawFavicon(canvas, text, bgColor, textColor, fontSize, PREVIEW_SIZES[i]);
      }
    });
  }, [text, bgColor, textColor, fontSize]);

  const handleDownloadPng = useCallback(async (size: number) => {
    const canvas = document.createElement("canvas");
    drawFavicon(canvas, text, bgColor, textColor, fontSize, size);
    const blob = await canvasToBlob(canvas, "image/png");
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `favicon-${size}x${size}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [text, bgColor, textColor, fontSize]);

  const handleDownloadIco = useCallback(async () => {
    const canvas = document.createElement("canvas");
    drawFavicon(canvas, text, bgColor, textColor, fontSize, 256);
    const blob = await createIcoBlob(canvas);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favicon.ico";
    a.click();
    URL.revokeObjectURL(url);
  }, [text, bgColor, textColor, fontSize]);

  const handleDownloadAllPng = useCallback(async () => {
    for (const size of [16, 32, 48, 180, 192, 512]) {
      const canvas = document.createElement("canvas");
      drawFavicon(canvas, text, bgColor, textColor, fontSize, size);
      const blob = await canvasToBlob(canvas, "image/png");
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `favicon-${size}x${size}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }, [text, bgColor, textColor, fontSize]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Favicon Generator</h1>
      <p className="text-gray-600 mb-6">
        Create a favicon from text characters. Pick your colors, adjust font size, preview
        at different sizes, and download as ICO or PNG. No uploads needed &mdash; everything
        happens in your browser.
      </p>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

          {/* Text input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text (1-2 characters)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 2))}
              maxLength={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ab"
            />
          </div>

          {/* Background color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Text color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Font size */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">Font Size</label>
              <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {fontSize}%
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={120}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30%</span>
              <span>120%</span>
            </div>
          </div>

          {/* Quick color presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Presets</label>
            <div className="flex flex-wrap gap-2">
              {[
                { bg: "#3b82f6", fg: "#ffffff", label: "Blue" },
                { bg: "#ef4444", fg: "#ffffff", label: "Red" },
                { bg: "#10b981", fg: "#ffffff", label: "Green" },
                { bg: "#8b5cf6", fg: "#ffffff", label: "Purple" },
                { bg: "#f59e0b", fg: "#000000", label: "Amber" },
                { bg: "#1f2937", fg: "#ffffff", label: "Dark" },
                { bg: "#ffffff", fg: "#1f2937", label: "Light" },
                { bg: "#ec4899", fg: "#ffffff", label: "Pink" },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setBgColor(preset.bg);
                    setTextColor(preset.fg);
                  }}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                  style={{ backgroundColor: preset.bg }}
                  title={preset.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main preview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="flex justify-center mb-6">
            <canvas
              ref={mainCanvasRef}
              width={256}
              height={256}
              className="rounded-xl shadow-lg"
              style={{ width: 192, height: 192 }}
            />
          </div>

          {/* Size previews */}
          <div className="flex items-end justify-center gap-4 mb-6">
            {PREVIEW_SIZES.slice(0, 4).map((size, i) => (
              <div key={size} className="text-center">
                <canvas
                  ref={(el) => { previewCanvasRefs.current[i] = el; }}
                  width={size}
                  height={size}
                  className="rounded border border-gray-200 mx-auto"
                  style={{ width: Math.max(size, 16), height: Math.max(size, 16) }}
                />
                <span className="text-xs text-gray-400 mt-1 block">{size}px</span>
              </div>
            ))}
          </div>

          {/* Browser tab preview */}
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">Browser tab preview</p>
            <div className="bg-white rounded-t-lg border border-gray-300 p-2 flex items-center gap-2 max-w-xs">
              <canvas
                ref={(el) => { previewCanvasRefs.current[4] = el; }}
                width={16}
                height={16}
                className="rounded-sm"
                style={{ width: 16, height: 16 }}
              />
              <span className="text-xs text-gray-700 truncate">My Website Title</span>
              <span className="text-gray-400 text-xs ml-auto">&times;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download buttons */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Download</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadIco}
            className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
          >
            Download .ICO (32x32)
          </button>
          <button
            onClick={() => handleDownloadPng(192)}
            className="py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium cursor-pointer"
          >
            Download PNG (192x192)
          </button>
          <button
            onClick={() => handleDownloadPng(512)}
            className="py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium cursor-pointer"
          >
            Download PNG (512x512)
          </button>
        </div>
        <div className="mt-3">
          <button
            onClick={handleDownloadAllPng}
            className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium cursor-pointer"
          >
            Download All Sizes (16, 32, 48, 180, 192, 512)
          </button>
        </div>
      </div>

      {/* Usage instructions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">How to Use Your Favicon</h2>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 overflow-x-auto">
          <p className="text-gray-500 text-xs mb-2">&lt;!-- Add to your HTML &lt;head&gt; --&gt;</p>
          <p>&lt;link rel=&quot;icon&quot; type=&quot;image/x-icon&quot; href=&quot;/favicon.ico&quot;&gt;</p>
          <p>&lt;link rel=&quot;icon&quot; type=&quot;image/png&quot; sizes=&quot;32x32&quot; href=&quot;/favicon-32x32.png&quot;&gt;</p>
          <p>&lt;link rel=&quot;icon&quot; type=&quot;image/png&quot; sizes=&quot;192x192&quot; href=&quot;/favicon-192x192.png&quot;&gt;</p>
          <p>&lt;link rel=&quot;apple-touch-icon&quot; sizes=&quot;180x180&quot; href=&quot;/favicon-180x180.png&quot;&gt;</p>
        </div>
      </div>

      <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center">
        Ad Space
      </div>

      <section className="mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Favicon Generator</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Create professional favicons from text characters without any design software. Enter
          one or two letters, pick your colors, and download in multiple formats and sizes.
          The ICO file works in all browsers, while PNG versions are ideal for modern browsers,
          Android home screens, and Apple touch icons. Everything is generated locally using the
          HTML5 Canvas API &mdash; no data is sent to any server.
        </p>
      </section>
    </div>
  );
}
